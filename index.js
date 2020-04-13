var fs = require("fs"),
  url = require("url"),
  http1 = require("http"),
  http2 = require("http2");

http1.createServer(handleRequest).listen(80);

http2
  .createSecureServer(
    {
      key: fs.readFileSync("private_key.pem"),
      cert: fs.readFileSync("certificate.pem"),
    },
    handleRequest
  )
  .listen(443);

async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const queryObject = parsedUrl.query;
  const pathname = parsedUrl.pathname;

  if (Object.keys(queryObject || {}).includes("delay")) {
    //delay 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  fs.readFile(__dirname + pathname, function (err, data) {
    if (err) {
      fs.readFile(__dirname + "/index.html", (err, data) => {
        res.writeHead(200);
        res.end(data);
      });
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}
