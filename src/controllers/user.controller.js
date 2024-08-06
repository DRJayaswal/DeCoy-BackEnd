import asyncHandler from "../utilities/asyncHandler.utility.js";
import User from "../models/user.model.js";
import ApiError from "../utilities/ApiError.utility.js";
import ApiResponse from "../utilities/ApiResponse.utility.js";

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
  const { userName, userPassword, userEmail, userContact, refreshToken } =
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
      secure: process.env.NODE_ENV === "production",
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

export { regUser, loginUser,logoutUser };
