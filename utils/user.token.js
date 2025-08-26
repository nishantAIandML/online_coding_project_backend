import jwt from "jsonwebtoken";
const generateToken=(user)=>{
  const accessToken=
    jwt.sign(
      { id: user._id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY||"1d" }
    )
    const refreshToken=
    jwt.sign(
      { id: user._id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY||"7d" }
    )
    return {accessToken,refreshToken};
}
export {generateToken};