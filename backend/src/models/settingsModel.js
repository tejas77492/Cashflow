const { query } = require("./baseModel");

const getSettings = async () => {
  const rows = await query(
    `SELECT
      id,
      cc_charge_percentage,
      bill_charge_percentage,
      branch_manager_share_percentage,
      head_manager_share_percentage,
      created_at,
      updated_at
     FROM settings
     ORDER BY id ASC
     LIMIT 1`
  );
  return rows[0];
};

const updateSettings = async ({
  cc_charge_percentage,
  bill_charge_percentage,
  branch_manager_share_percentage,
  head_manager_share_percentage,
}) => {
  const current = await getSettings();

  if (!current) {
    await query(
      `INSERT INTO settings
      (cc_charge_percentage, bill_charge_percentage, branch_manager_share_percentage, head_manager_share_percentage)
      VALUES (?, ?, ?, ?)`,
      [
        cc_charge_percentage,
        bill_charge_percentage,
        branch_manager_share_percentage,
        head_manager_share_percentage,
      ]
    );
  } else {
    await query(
      `UPDATE settings
       SET cc_charge_percentage = ?,
           bill_charge_percentage = ?,
           branch_manager_share_percentage = ?,
           head_manager_share_percentage = ?
       WHERE id = ?`,
      [
        cc_charge_percentage,
        bill_charge_percentage,
        branch_manager_share_percentage,
        head_manager_share_percentage,
        current.id,
      ]
    );
  }

  return getSettings();
};

module.exports = {
  getSettings,
  updateSettings,
};
