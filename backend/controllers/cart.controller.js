import Product from "../schema/product.schema.js"

// ok done
export const getcartItems = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } })

        // this add quantity into object that from cartItems inside
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product.id)
            return { ...product.toJSON(), quantity: item.quantity }
        })

        // res.json(products)
        res.json(cartItems)

    } catch (error) {
        console.log("error in getCartItems controller : ", error)
        res.status(500).json({ message: "error getCartItems : ", error })

    }
}


// ok done
export const addtoCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1
        }

        else {
            user.cartItems.push(productId)
        }

        await user.save();
        res.json(user.cartItems)

    } catch (error) {
        console.log("error in addTocart controller : ", error)
        res.status(500).json({ message: "error addTocart : ", error })
    }

}


// ok done
export const removeAllItems = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        }
        else {
            user.cartItems = user.cartItems.filter((item) => item.id != productId)
        }

        await user.save();
        res.json(user.cartItems)


    } catch (error) {
        console.log("error in removeall items controller : ", error)
        res.status(500).json({ message: "error removeall items : ", error })

    }

}

// ok done
export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body
        const user = req.user;

        const existingItem = user.cartItems.find((item) => item.id === productId)

        if (existingItem) {
            // this is use for to delete product from cart mean user put 0 it mean delete from cart
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId)
                await user.save()
                return res.json(user.cartItems)
            }

            // set quantity what user enter quantity
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems)
        }
        else {
            return res.status(404).json({ message: "product is not found" });
        }


    } catch (error) {
        console.log("error in updateQuantity controller : ", error)
        res.status(500).json({ message: "error updateQuantity : ", error })

    }
}