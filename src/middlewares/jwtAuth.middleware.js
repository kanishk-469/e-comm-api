import jwt from "jsonwebtoken";
export const jwtAuth = (req, res, next) => {
  // 1. Read the token
  const authToken = req.headers["authorization"];
  // console.log(authToken);

  //2. if no token return error
  if (!authToken) {
    return res.status(401).send("Unauthorized");
  }

  //3. check/verify if token is valid
  try {
    const payload = jwt.verify(authToken, "KKJXxpGMjGFerPCUGXdt89jOFZ6H47Vc");
    req.userId = payload.userID;
    // console.log(payload);
  } catch (err) {
    //4. return error
    console.log(err);
    return res.status(401).send("Unauthorized");
  }

  //5. call next middleware
  next();
};
