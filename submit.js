const submit = (connection) => {
  return async (req, res) => {
    const topic = req.query.topic;
    const userid = req.query.userid;
    const username = req.query.username;
    const submittedAnswers = req.body.answers;
    if (!Array.isArray(submittedAnswers)) {
      res.status(400).json({ error: "Invalid submitted answers format" });
      return;
    }

    // Fetch the correct answers from the database
    const query = "SELECT id, answer FROM quiz";
    const questions = await connection.any(query);

    // Calculate the score
    let score = 0;
    for (const submittedAnswer of submittedAnswers) {
      const question = questions.find((q) => q.id === submittedAnswer.id);
      if (question && question.answer === submittedAnswer.answers[0]) {
        score++;
      }
    }

    connection
      .one(
        "INSERT INTO score (user_id, quiz_topic, score) VALUES ($1, $2, $3) ON CONFLICT (user_id, quiz_topic) DO UPDATE SET score = $3 RETURNING *",
        [userid, topic, score]
      )
      .then((data) => {
        console.log(data);
        res.json({ score: score, data: data });
      });
  };
};

module.exports = submit;
