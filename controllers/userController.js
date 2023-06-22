const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../db")
require("dotenv").config();
exports.userSignupGet = asyncHandler((req, res, next) => {
  res.render("sign-up-form", { title: "Sign up" });
});

exports.userSignupPost = [
  body("firstname").notEmpty().trim().escape(),
  body("lastname").notEmpty().trim().escape(),
  body("username").notEmpty().trim().escape(),
  body("password").notEmpty().trim().escape(),
  body("confirmpassword")
    .notEmpty()
    .trim()
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { firstname, lastname, username, password, isadmin } = req.body;
    if (errors.isEmpty()) {
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        await User.create({
          firstname,
          lastname,
          username,
          password: hashedPassword,
          admin: isadmin,
          membership_status: isadmin ? true : false,
        });
      });
      res.redirect("/login");
    } else {
      res.render("sign-up-form", { title: "Sign Up", errors: errors.array() });
    }
  }),
];

exports.userLoginGet = asyncHandler((req, res, next) => {
  res.render("log-in-form", { title: "Login" });
});

exports.userLoginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});

exports.userLogoutGet = (req, res) => {
  if (res.user) res.render("logout", { title: "Logout" });
  else res.redirect("/");
};

exports.userLogoutPost = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.clubMemberGet = (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    res.render("join-club", { title: "Join the club" });
  }
};

exports.clubMemberPost = [
  body("secretcode").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!req.user) {
      res.redirect("/login");
    } else if (!errors.isEmpty) {
      res.render("join-club", {
        title: "Join the club",
        errors: errors.array(),
      });
    } else if (req.body.secretcode === process.env.SECRET_KEY) {
      const user = await User.findByPk(req.user.id);
      await user.update({ membership_status: true });
      res.redirect("/");
    } else if (req.body.secretcode !== process.env.SECRET_KEY) {
      const errors = errors.array().push({ msg: "Secret code is incorrect!" });
      res.render("join-club", {
        title: "Join the club",
        errors: errors,
      });
    }
  }),
];
