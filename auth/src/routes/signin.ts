import express from "express";

const router = express.Router();

router.post("/api/users/signin", (req, res) => {
  res.send("Sign In route");
});

export default router;
