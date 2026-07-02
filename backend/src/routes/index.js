const express = require("express");
const authRoutes = require("./authRoutes");
const customerRoutes = require("./customerRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);

module.exports = router;
