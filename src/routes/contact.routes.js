import express from "express";
import { getContactInfo, updateContactInfo } from "../controllers/contact.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/',getContactInfo);
router.put('/', protect, updateContactInfo);

export default router;