const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

app.all('/api/*', (req, res) => {
  proxy.web(req, res, {
    target: API_ENDPOINT,
    changeOrigin: true,
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Proxy server is running on port ${port}`));
