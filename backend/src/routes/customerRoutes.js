const express = require("express");
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateCustomer } = require("../middlewares/validationMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", customerController.list);
router.get("/:id", customerController.getById);
router.post("/", validateCustomer, customerController.create);
router.put("/:id", validateCustomer, customerController.update);
router.delete("/:id", customerController.remove);

module.exports = router;
