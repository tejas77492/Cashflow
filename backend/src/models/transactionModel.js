const { query } = require("./baseModel");

const buildTransactionFilters = ({ branchId, dateFrom, dateTo, type }) => {
  const conditions = [];
  const params = [];

  if (branchId) {
    conditions.push("t.branch_id = ?");
    params.push(branchId);
  }

  if (dateFrom) {
    conditions.push("t.date >= ?");
    params.push(dateFrom);
  }

  if (dateTo) {
    conditions.push("t.date <= ?");
    params.push(dateTo);
  }

  if (type) {
    conditions.push("t.type = ?");
    params.push(type);
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const createTransaction = async ({
  date,
  branch_id,
  type,
  portal_id,
  amount,
  customer_charge,
  discount,
  portal_cost,
  profit,
  created_by,
}) => {
  const result = await query(
    `INSERT INTO transactions
    (date, branch_id, type, portal_id, amount, customer_charge, discount, portal_cost, profit, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      date,
      branch_id,
      type,
      portal_id,
      amount,
      customer_charge,
      discount,
      portal_cost,
      profit,
      created_by,
    ]
  );

  return getTransactionById(result.insertId);
};

const getTransactionById = async (id) => {
  const rows = await query(
    `SELECT t.id, t.date, t.branch_id, b.name AS branch_name, t.type, t.portal_id, p.name AS portal_name,
            t.amount, t.customer_charge, t.discount, t.portal_cost, t.profit,
            t.created_by, u.name AS created_by_name, t.created_at
     FROM transactions t
     INNER JOIN branches b ON b.id = t.branch_id
     INNER JOIN portals p ON p.id = t.portal_id
     INNER JOIN users u ON u.id = t.created_by
     WHERE t.id = ?`,
    [id]
  );
  return rows[0];
};

const getTransactions = ({ branchId, dateFrom, dateTo, type } = {}) => {
  const { whereClause, params } = buildTransactionFilters({ branchId, dateFrom, dateTo, type });

  return query(
    `SELECT t.id, t.date, t.branch_id, b.name AS branch_name, t.type, t.portal_id, p.name AS portal_name,
            t.amount, t.customer_charge, t.discount, t.portal_cost, t.profit,
            t.created_by, u.name AS created_by_name, t.created_at
     FROM transactions t
     INNER JOIN branches b ON b.id = t.branch_id
     INNER JOIN portals p ON p.id = t.portal_id
     INNER JOIN users u ON u.id = t.created_by
     ${whereClause}
     ORDER BY t.date DESC, t.id DESC`,
    params
  );
};

const getTransactionSummary = async ({ branchId, dateFrom, dateTo } = {}) => {
  const { whereClause, params } = buildTransactionFilters({ branchId, dateFrom, dateTo });
  const rows = await query(
    `SELECT
        COUNT(*) AS transaction_count,
        COALESCE(SUM(t.amount), 0) AS total_transaction_amount,
        COALESCE(SUM(CASE WHEN t.type = 'bill' THEN t.amount ELSE 0 END), 0) AS total_bill_amount,
        COALESCE(SUM(CASE WHEN t.type = 'cc' THEN t.amount ELSE 0 END), 0) AS total_cc_amount,
        COALESCE(SUM(t.customer_charge), 0) AS total_customer_charge,
        COALESCE(SUM(t.discount), 0) AS total_discount_amount,
        COALESCE(SUM(t.portal_cost), 0) AS total_portal_cost,
        COALESCE(SUM(t.profit), 0) AS total_profit_amount
     FROM transactions t
     ${whereClause}`,
    params
  );

  return rows[0];
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionSummary,
};
