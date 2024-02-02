const express = require("express");
let jimp = require('jimp');
const app = new express();
const multer = require("multer");
const upload = multer();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));

app.listen(3000, () => {
  console.log("App listening on port 3000");
});

app.post("/compressimage", upload.single("file"), (req, res) => {
  jimp.read(req.file.buffer, function (errRead, img) {
    if (errRead) throw errRead; 
    img.quality(Number(req.body.compressPercent));

    img.getBuffer(jimp.MIME_JPEG, (errWrite, buffer) => {
      if (errWrite) throw errWrite;

      res.writeHead(200, {
        "Content-Type": "image/jpg",
        "Content-Length": buffer.length
      });
      res.end(buffer);
      return;
    });
  });
});
