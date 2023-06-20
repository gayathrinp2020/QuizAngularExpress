const profile = (connection) => {
  return (req, res) => {
    const jwt = require("jsonwebtoken");
    const token = req.headers["authorization"];
    const username = req.query.username;
    console.log(username);
    try {
      const decoded = jwt.verify(token, "Hello");
      req.user = decoded;

      let query =
        "SELECT register.username, register.email, score.quiz_topic, score.score FROM register JOIN score ON register.id = score.user_id";

      if (username) {
        query += ` WHERE register.username = '${username}'`;
      }

      connection.any(query).then((data) => {
        console.log(data);
        res.json(data);
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Data" });
    }
  };
};

module.exports = profile;
