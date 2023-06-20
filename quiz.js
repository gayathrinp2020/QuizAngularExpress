const quiz = (connection) => {
  return (req, res) => {
    const jwt = require("jsonwebtoken");
    const topic = req.query.topic;
    const token = req.headers["authorization"];
    // console.log(token);
    try {
      const decoded = jwt.verify(token, "Hello");
      req.user = decoded;

      let query = "SELECT id, question, options FROM quiz";

      if (topic) {
        query += ` WHERE title = '${topic}'`;
      }

      connection.any(query).then((data) => {
        const response = {
          data: data,
          decoded: decoded,
        };
        res.json(response);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
  };
};

module.exports = quiz;
