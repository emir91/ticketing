import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@emir-tickets/common";
import newRouterHandler from "../src/routes/new";

const app = express();

app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  })
);

app.use(newRouterHandler);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
