const { query } = require("./baseModel");

const getAllPortals = () =>
  query("SELECT id, name, charge_percentage, created_at, updated_at FROM portals ORDER BY id DESC");

const getPortalById = async (id) => {
  const rows = await query(
    "SELECT id, name, charge_percentage, created_at, updated_at FROM portals WHERE id = ?",
    [id]
  );
  return rows[0];
};

const createPortal = async ({ name, charge_percentage }) => {
  const result = await query("INSERT INTO portals (name, charge_percentage) VALUES (?, ?)", [
    name,
    charge_percentage,
  ]);
  return getPortalById(result.insertId);
};

const updatePortal = async (id, { name, charge_percentage }) => {
  await query("UPDATE portals SET name = ?, charge_percentage = ? WHERE id = ?", [
    name,
    charge_percentage,
    id,
  ]);
  return getPortalById(id);
};

const deletePortal = (id) => query("DELETE FROM portals WHERE id = ?", [id]);

module.exports = {
  getAllPortals,
  getPortalById,
  createPortal,
  updatePortal,
  deletePortal,
};
