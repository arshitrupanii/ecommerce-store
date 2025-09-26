import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { addtoCart, getcartItems, removeAllItems, updateQuantity } from "../controllers/cart.controller.js"


const router = express.Router()

// all tested
router.get('/', protectRoute, getcartItems)
router.post('/', protectRoute, addtoCart)
router.delete('/', protectRoute, removeAllItems)
router.put('/:id', protectRoute, updateQuantity)



export default router