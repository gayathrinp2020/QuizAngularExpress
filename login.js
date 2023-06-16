const login = (connection) => {
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const secretKey = "Hello";

  return (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    connection
      .oneOrNone("SELECT * FROM register WHERE username = $1", [username])
      .then((data) => {
        if (data && bcrypt.compareSync(password, data.password)) {
          const user = {
            id: data.id,
            username: data.username,
          };
          const token = jwt.sign(user, secretKey);
          res.json({ message: "Login successful", token: token });
        } else {
          res.status(401).json({ error: "Invalid username or password" });
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  };
};

module.exports = login;
