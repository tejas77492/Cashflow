const { query } = require("./baseModel");

const buildExpenseFilters = ({ branchId, dateFrom, dateTo }) => {
  const conditions = [];
  const params = [];

  if (branchId) {
    conditions.push("e.branch_id = ?");
    params.push(branchId);
  }

  if (dateFrom) {
    conditions.push("e.date >= ?");
    params.push(dateFrom);
  }

  if (dateTo) {
    conditions.push("e.date <= ?");
    params.push(dateTo);
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const createExpense = async ({ branch_id, amount, description, date }) => {
  const result = await query(
    "INSERT INTO expenses (branch_id, amount, description, date) VALUES (?, ?, ?, ?)",
    [branch_id, amount, description, date]
  );
  return getExpenseById(result.insertId);
};

const getExpenseById = async (id) => {
  const rows = await query(
    `SELECT e.id, e.branch_id, b.name AS branch_name, e.amount, e.description, e.date, e.created_at
     FROM expenses e
     INNER JOIN branches b ON b.id = e.branch_id
     WHERE e.id = ?`,
    [id]
  );
  return rows[0];
};

const getExpenses = ({ branchId, dateFrom, dateTo } = {}) => {
  const { whereClause, params } = buildExpenseFilters({ branchId, dateFrom, dateTo });

  return query(
    `SELECT e.id, e.branch_id, b.name AS branch_name, e.amount, e.description, e.date, e.created_at
     FROM expenses e
     INNER JOIN branches b ON b.id = e.branch_id
     ${whereClause}
     ORDER BY e.date DESC, e.id DESC`,
    params
  );
};

const getExpenseSummary = async ({ branchId, dateFrom, dateTo } = {}) => {
  const { whereClause, params } = buildExpenseFilters({ branchId, dateFrom, dateTo });
  const rows = await query(
    `SELECT
        COUNT(*) AS expense_count,
        COALESCE(SUM(e.amount), 0) AS total_expense_amount
     FROM expenses e
     ${whereClause}`,
    params
  );

  return rows[0];
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseSummary,
};
