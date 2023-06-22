const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Message = require("../models/message");
const { validationResult, body } = require("express-validator");

exports.createMessageGet = (req, res) => {
  if (req.user) res.render("new-message-form", { title: "New Message" });
  else res.redirect("/");
};

exports.createMessagePost = [
  body("title").trim().escape(),
  body("content").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty)
      res.render("new-message-form", {
        title: "New Message",
        errors: errors.array(),
      });
    else {
      const message = await Message.create({
        title: req.body.title,
        content: req.body.content,
      });
      const user = await User.findByPk(req.user.id);
      await user.addMessage(message);

      res.redirect("/");
    }
  }),
];

exports.deleteMessageGet = asyncHandler(async (req, res) => {
  if (!req.user) res.redirect("/");
  const message = await Message.findByPk(req.params.id);
  if (message)
    res.render("delete-message", { title: "Delete Message", msg: message });
  else res.redirect("/");
});

exports.deleteMessagePost = asyncHandler(async (req, res) => {
  if (!req.user && !req.user.admin) res.redirect("/");
  const message = await Message.findByPk(req.params.id);
  if (message) {
    await message.destroy();
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});
