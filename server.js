const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
const puppeteer = require("puppeteer");

app.use(
  cors({
    origin: "*",
  }),
  express.json({
    extended: false,
  }),
  express.static("public")
);

app.use("/images", express.static("images"));

app.get("https://upvote-case-backend.herokuapp.com/:id", (req, res) => {
  var fileName = req.params.id;
  res.sendFile(`https://upvote-case-backend.herokuapp.com/${fileName}`);
});

app.post("/api", async (req, res) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(req.body.url, { waitUntil: "networkidle2" });

    let screenshotUrl = `./images/${Math.floor(Math.random() * 1000000)}.png`;
    await page.screenshot({
      path: screenshotUrl,
    });

    await browser.close();
    res.send({ url: screenshotUrl });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
