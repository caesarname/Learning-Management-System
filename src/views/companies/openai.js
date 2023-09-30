function sendMessageToOpenAI(message) {
    return new Promise((resolve, reject) => {
      fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`
        },
        body: JSON.stringify({
          prompt: `User: ${message}\nBot:`,
          max_tokens: 60,
          temperature: 0.7,
          n: 1,
          stop: "\n"
        })
      })
      .then(response => response.json())
      .then(data => resolve(data.choices[0].text.trim()))
      .catch(error => reject(error));
    });
  }
  