const submit = (connection) => {
  return async (req, res) => {
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
    res.json({ score: score });
  };
};

module.exports = submit;
