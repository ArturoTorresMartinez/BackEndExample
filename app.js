const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolver");
const cors = require("cors");
const app = express();

//API accessible for everyone!
app.options("*", cors());
app.use(cors());

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const MONGODB_URI =
  "mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-e7jon.mongodb.net/${process.env.MONGO_DB}?retryWrites=true";
mongoose
  .connect(MONGODB_URI, { useFindAndModify: false, useNewUrlParser: true })
  .then(result => {
    //Just making sure it runs on the service provider intended port or 3000!
    app.listen(process.env.PORT || 3000);
    console.log("Listening to port 3000!");
  })
  .catch(err => console.log(err));
