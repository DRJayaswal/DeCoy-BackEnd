/* eslint-disable no-unused-vars */

import asyncHandler from "../utilities/asyncHandler.utility.js";
import User from "../models/user.model.js";

const isEmpty = (string) => {
    return !string || string.length === 0;
};

const regUser = asyncHandler(async (req, res) => {
    const { userName, userPassword, userEmail, handleName, userHistory, userPlaylist, userAlbum, userContact } = req.body;
    if (isEmpty(userName) || isEmpty(userPassword) || isEmpty(userEmail)) {
        res.status(400).send("Username, Password, and Email are required.");
        return;
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
        res.status(409).send("Username or Email already exists.");
        return;
    }
    const user = new User.create({
        userName,
        handleName,
        userContact,
        userEmail,
        userPassword
    })
});

const loginUser = asyncHandler(async (req, res) => {
    const { userName, userPassword } = req.body;

    if (isEmpty(userName) || isEmpty(userPassword)) {
        res.status(400).send("Both username and password are required.");
        return;
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            res.status(404).send("User doesn't exist.");
        } else {
            const passwordMatches = await user.passwordChecker(userPassword);
            if (passwordMatches) {
                res.status(200).send("Login successful.");
            } else {
                res.status(401).send("Incorrect password.");
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error. Please try again later.");
    }
});

export {
    regUser,
    loginUser,
};