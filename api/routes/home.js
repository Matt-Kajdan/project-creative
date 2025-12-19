// api/routes/home.js

const express = require("express");
const router = express.Router();
const { getHomeData } = require("../controllers/homeController");

// GET /home
router.get("/", getHomeData);

module.exports = router;
