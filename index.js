var fs = require("fs"),
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

function handleRequest(req, res) {
  fs.readFile(__dirname + req.url, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}
