if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const clientsRouter = require("./routes/customer");
const productsRouter = require("./routes/product");
const transactionsRouter = require("./routes/transaction");

// layout/views setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded());

// connect to db
console.log(process.env.DATABASE_URL);
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose..."));

// main router
app.use("/app", indexRouter);
app.use("/customers", clientsRouter);
app.use("/products", productsRouter);
app.use("/transactions", transactionsRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log("Listening on port 8080...");
});
