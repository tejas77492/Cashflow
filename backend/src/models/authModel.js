const { query } = require("./baseModel");

const findUserByEmail = async (email) => {
  const rows = await query(
    `SELECT u.id, u.name, u.email, u.password, u.role, u.branch_id, b.name AS branch_name
     FROM users u
     LEFT JOIN branches b ON b.id = u.branch_id
     WHERE u.email = ?`,
    [email]
  );

  return rows[0];
};

module.exports = {
  findUserByEmail,
};
