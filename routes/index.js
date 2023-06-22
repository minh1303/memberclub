var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");
var messageController = require("../controllers/messageController");
var Message = require("../models/message");
var asyncHandler = require("express-async-handler");
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allMessages = await Message.findAll();
    if (!req.user)
      res.render("index", {
        title: "Club house",
        messages: allMessages,
      });
    else {
      for (let i = 0; i < allMessages.length; i++) {
        allMessages[i].author = await allMessages[i].getUser();
      }
      res.render("index", {
        title: "Club house",
        user: req.user,
        messages: allMessages,
      });
    }
  })
);

router.get("/signup", userController.userSignupGet);
router.post("/signup", userController.userSignupPost);

router.get("/login", userController.userLoginGet);
router.post("/login", userController.userLoginPost);
router.get("/join", userController.clubMemberGet);
router.post("/join", userController.clubMemberPost);

router.get("/newmessage", messageController.createMessageGet);
router.post("/newmessage", messageController.createMessagePost);

router.get("/logout", userController.userLogoutGet);
router.post("/logout", userController.userLogoutPost);

router.get("/message/:id/delete", messageController.deleteMessageGet)
router.post("/message/:id/delete", messageController.deleteMessagePost)

module.exports = router;
