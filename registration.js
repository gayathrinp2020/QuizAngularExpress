const registration = (connection) => {
  const bcrypt = require("bcrypt");
  return (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    // Hash the password synchronously
    const hashedPassword = bcrypt.hashSync(password, 10);

    console.log("Hashed password:", hashedPassword);
    console.log(req.body);
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
  };
};

module.exports = (connection) => registration(connection);
