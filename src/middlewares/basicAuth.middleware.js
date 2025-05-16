import UserModel from "../features/user/user.model.js";

export const basicAuthorizer = (req, res, next) => {
  //1. check if authorization header is empty
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("No Authorization details found");
  }

  console.log(authHeader);
  //2. Extract Credentials. [Basic qwertyrffghgtkrjtrgr]
  const base64Credentials = authHeader.replace("Basic", "");
  console.log(base64Credentials);

  //3. Decode Credentials
  const decodedCreds = Buffer.from(base64Credentials, "base64").toString(
    "utf8"
  );
  console.log(decodedCreds); //[username:password]
  const creds = decodedCreds.split(":");
  console.log(creds); // array

  const user = UserModel.getAll().find(
    (usr) => usr.email == creds[0] && usr.password == creds[1]
  );

  if (!user) {
    return res.status(401).send("Incorrect Credentials");
  } else {
    next();
  }
};
