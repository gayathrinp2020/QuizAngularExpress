const reset_password = (connection) => {
  const bcrypt = require("bcrypt");
  return async (req, res) => {
    const email = req.body.email;
    const newpassword = req.body.newpassword;
    console.log(newpassword);
    connection
      .oneOrNone("SELECT * FROM register WHERE email = $1", [email])
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "Email not found" });
        } else {
          const hashedPassword = bcrypt.hashSync(newpassword, 10);

          connection
            .none("UPDATE register SET password = $1 WHERE email = $2", [
              hashedPassword,
              email,
            ])
            .then(() => {
              res.json({ message: "Password updated successfully" });
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ message: "Internal server error" });
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      });
  };
};

module.exports = reset_password;
