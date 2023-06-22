const registration = (connection) => {
  const bcrypt = require("bcrypt");
  return (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    connection
      .oneOrNone("SELECT * FROM register WHERE username = $1", [username])
      .then((existingUser) => {
        if (existingUser) {
          // Username already exists
          res.status(400).json({ message: "Username already exists" });
        } else {
          // Hash the password synchronously
          const hashedPassword = bcrypt.hashSync(password, 10);

          connection
            .one(
              "INSERT INTO register (username, email, password) VALUES ($1, $2, $3) RETURNING *",
              [username, email, hashedPassword]
            )
            .then((data) => {
              res.json(data); // Send the inserted data as the response
            })
            .catch((error) => {
              console.error("Registration error:", error);
              res.status(500).json({ error: "Internal server error" });
            });
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  };
};

module.exports = (connection) => registration(connection);
