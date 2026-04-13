import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import SummaryCard from "../components/SummaryCard";
import { apiRequest } from "../services/api";
import { getStoredUser } from "../utils/storage";
import {
  exportRowsToCsv,
  formatCurrency,
  formatTransactionType,
  getCurrentMonth,
  getMonthRange,
  formatMonthLabel,
} from "../utils/reporting";

const TX_COLS = [
  { key: "date", label: "Date" },
  { key: "branch_name", label: "Branch" },
  { key: "type", label: "Type", render: (r) => (
    <span className={`badge ${r.type === "cc" ? "badge-blue" : "badge-amber"}`}>
      {formatTransactionType(r.type)}
    </span>
  )},
  { key: "portal_name", label: "Portal" },
  { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount) },
  { key: "customer_charge", label: "Charge", render: (r) => formatCurrency(r.customer_charge) },
  { key: "discount", label: "Discount", render: (r) => Number(r.discount) > 0 ? formatCurrency(r.discount) : "—" },
  { key: "portal_cost", label: "Portal Cost", render: (r) => formatCurrency(r.portal_cost) },
  { key: "profit", label: "Profit", render: (r) => (
    <span style={{ color: Number(r.profit) >= 0 ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
      {formatCurrency(r.profit)}
    </span>
  )},
];

export default function TransactionListPage() {
  const user = getStoredUser();
  const [branches, setBranches] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({ month: getCurrentMonth(), branch_id: "", type: "" });

  useEffect(() => {
    const load = async () => {
      const { dateFrom, dateTo } = getMonthRange(filters.month);
      const q = new URLSearchParams();
      if (dateFrom) q.set("date_from", dateFrom);
      if (dateTo) q.set("date_to", dateTo);
      if (user?.role === "admin" && filters.branch_id) q.set("branch_id", filters.branch_id);
      if (filters.type) q.set("type", filters.type);

      const [txs, sum, bs] = await Promise.all([
        apiRequest(`/transactions?${q}`),
        apiRequest(`/transactions/summary?${q}`),
        user?.role === "admin" ? apiRequest("/branches") : Promise.resolve([]),
      ]);
      setTransactions(txs);
      setSummary(sum);
      setBranches(bs);
    };
    load();
  }, [filters]);

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="page-header">
        <h2>Transaction Records</h2>
        <p>Filter by month, branch, or type. Export as CSV for your records.</p>
      </div>

      <div className="panel filter-strip" style={{ marginBottom: 20 }}>
        <label>
          Month
          <input type="month" value={filters.month} onChange={(e) => set("month", e.target.value)} style={{ width: "auto" }} />
        </label>
        {user?.role === "admin" && (
          <label>
            Branch
            <select value={filters.branch_id} onChange={(e) => set("branch_id", e.target.value)} style={{ width: "auto" }}>
              <option value="">All Branches</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
        )}
        <label>
          Type
          <select value={filters.type} onChange={(e) => set("type", e.target.value)} style={{ width: "auto" }}>
            <option value="">All Types</option>
            <option value="bill">Bill Payment</option>
            <option value="cc">CC Transfer</option>
          </select>
        </label>
        <button
          className="btn btn-outline btn-sm"
          style={{ alignSelf: "flex-end" }}
          onClick={() => exportRowsToCsv(`transactions-${filters.month}.csv`, TX_COLS, transactions)}
        >
          ↓ Export CSV
        </button>
      </div>

      <div className="summary-grid" style={{ marginBottom: 20 }}>
        <SummaryCard title="Transactions" value={summary?.transaction_count || 0} accent="#3b82f6" />
        <SummaryCard title="Total Amount" value={formatCurrency(summary?.total_transaction_amount)} accent="#6366f1" />
        <SummaryCard title="Bill Total" value={formatCurrency(summary?.total_bill_amount)} accent="#f59e0b" />
        <SummaryCard title="CC Total" value={formatCurrency(summary?.total_cc_amount)} accent="#8b5cf6" />
        <SummaryCard title="Discounts" value={formatCurrency(summary?.total_discount_amount)} accent="#ef4444" />
        <SummaryCard title="Total Profit" value={formatCurrency(summary?.total_profit_amount)} accent="#10b981" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Transactions — {formatMonthLabel(filters.month)}</h3>
          <span className="badge badge-blue">{transactions.length} records</span>
        </div>
        <DataTable columns={TX_COLS} data={transactions} emptyText="No transactions found for this period." />
      </div>
    </div>
  );
}
