import jwt from "jsonwebtoken";

export const cookieGenerator = () => {
  // Build a JWT payload
  const payload = {
    id: "253tdgdyw64",
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object
  const session = { jwt: token };

  // Turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
