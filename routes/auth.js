const express = require("express");
const Admin = require("../models/admin");
const router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('../config/database')
const verifyAdmin = require("../verify-admin");

router.post("/", async (req, res) => {
  const password = req.body.password;
  const admin = await Admin.checkAdminAuth(password);
  if (admin) {
    // Return auth token
    const token = await jwt.sign({ organizer: admin.label }, config.secret, {
      expiresIn: 604800, // 1 week
    });
    return res.json({ success: true, token })
  } else {
    res.sendStatus(401); // unauthorized
  }
});

router.get("/test", verifyAdmin, (req, res) => {
  res.sendStatus(200) // ok
})

module.exports = router;
