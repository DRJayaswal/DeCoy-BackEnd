/* eslint-disable no-unused-vars */
import asyncHandler from "../utilities/asyncHandler.utility.js";
import User from "../models/user.model.js";
import ApiError from "../utilities/ApiError.utility.js";
import ApiResponse from "../utilities/ApiResponse.utility.js";
import process from "process"
import jwt from "jsonwebtoken"

const isEmpty = (string) => {
  return !string || string.length === 0;
};
const genAccRef = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genAccessToken();
    const refreshToken = user.genRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};





const regUser = asyncHandler(async (req, res) => {
  const { userName, userPassword, userEmail, userContact } =
    req.body;
  if (isEmpty(userName) || isEmpty(userPassword) || isEmpty(userEmail)) {
    throw new ApiError(400, "All fields are required");
  }
  if (userContact <= 999999999 || userContact > 10000000000) {
    res.status(400).send("Invalid contact number.");
    return;
  }
  if (!userEmail.includes("@gmail.com")) {
    res.status(400).send("Email should contain '@gmail.com'.");
    return;
  }
  const userExists = await User.findOne({ userName });
  if (userExists) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const user = await User.create({
    userName,
    userContact,
    userEmail,
    userPassword,
  });
  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  const createdUser = await User.findById(user._id).select(
    "-userPassword -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createdUser,
        `${createdUser.userName} registered Successfully`
      )
    );
});
const loginUser = asyncHandler(async (req, res) => {
  const { userName, userPassword } = req.body;

  if (isEmpty(userName) || isEmpty(userPassword)) {
    throw new ApiError(400, "Username or password is required");
  }

  const user = await User.findOne({ userName });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const passwordMatches = await user.passwordChecker(userPassword);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await genAccRef(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user, accessToken, refreshToken
        },
        "User Logged In Successfully !!"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("accessToken", cookieOptions)
    .json(
      new ApiResponse(200, {}, `${req.user.userName} Logged Out Successfully !!`)
    );
});
const renewSession = asyncHandler(async (req, res) => {
  const userRefToken = req.cookies.refreshToken || req.body.refreshToken
  if (!userRefToken) {
    throw new ApiError(401, "Unauthorized Access")
  }
  try {
    const decToken = jwt.verify(userRefToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decToken?._id)
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token")
    }
    if (userRefToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token Expired")
    }
    const cookieOptions = {
      httpOnly: true,
      secure: true
    }
    const { accessToken, NewrefreshToken } = await genAccRef(user._id)
    return res.status(200).cookie("accessToken", accessToken, cookieOptions).cookie("refreshToken", NewrefreshToken, cookieOptions).json(
      new ApiResponse(200, { accessToken }, "Access Token Refreshed")
    )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token")
  }
})
const changePassword = asyncHandler(async (req,res) => {
  const {oldPassword, newPassword, confirmPassword} = req.body
  if(newPassword !== confirmPassword){
    throw new ApiError(400, "New Password and Confirm Password should be same")
  }
  const user = await User.findById(req.user?._id)
  const passwordValidation = await user.passwordChecker(oldPassword)
  if(!passwordValidation){
    throw new ApiError(401, "Invalid Old Password")
  }
  user.userPassword = newPassword
  await user.save({validateBeforeSave:true})

  return res.status(200).json(
    new ApiResponse(200, {}, "Password Changed Successfully")
  )


})
const currentUser = asyncHandler(async (req,res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      `${req.user.userName} is the current user`
    )
)
});
const updateAccount = asyncHandler(async (req, res) => {
  const { userName, userEmail, userContact } = req.body;

  if (!userName || !userEmail) {
    return res.status(400).send("All fields are required.");
  }

  if (userContact < 1000000000 || userContact >= 10000000000) {
    return res.status(400).send("Invalid contact number.");
  }

  if (!userEmail.includes("@gmail.com")) {
    return res.status(400).send("Email should contain '@gmail.com'.");
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { userName, userEmail, userContact },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(500).send("Something went wrong while updating the user.");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        user,
        `${user.userName}'s account updated successfully.`
      )
    );
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
});
const playHistory = asyncHandler(async (req,res) => {

})

export { regUser, loginUser, logoutUser,renewSession,changePassword, currentUser, updateAccount, playHistory }
