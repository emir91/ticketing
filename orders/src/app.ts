import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@emir-tickets/common";
import indexRouterHandler from "./routes/index";
import newRouterHandler from "./routes/new";
import showRouterHandler from "./routes/show";
import deleteRouterHandler from "./routes/delete";

const app = express();

app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  })
);

app.use(currentUser);

app.use(indexRouterHandler);
app.use(newRouterHandler);
app.use(showRouterHandler);
app.use(deleteRouterHandler);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
