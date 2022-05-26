const express = require("express");
const app = express();
const port = 2000;

const clubsRouter = require("./routes/clubs");
const bookingsRouter = require("./routes/bookings");
const clubDaysRouter = require("./routes/clubDays");
const res = require("express/lib/response");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json({ message: "ok" });
});

app.use("/clubs", clubsRouter);
app.use("/bookings", bookingsRouter);
app.use("/clubdays", clubDaysRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});