import express from "express"
import { createProduct, deleteProduct, getAllProducts, getFeaturedProduct, getProductByCategory, getrecommendedProduct, toggleFeaturedProduct } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

// all tested
router.get("/", protectRoute, adminRoute, getAllProducts)
router.get("/featuredProduct", getFeaturedProduct)
router.get("/recommendations", getrecommendedProduct)
router.get("/category/:category", getProductByCategory)

router.post("/", protectRoute, adminRoute, createProduct)
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)

export default router;