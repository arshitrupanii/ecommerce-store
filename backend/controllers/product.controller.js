import { redis } from "../lib/redis.js";
import Product from "../schema/product.schema.js"
import cloudinary from "../lib/cloudinary.js"


// ok done
export const getallProducts = async (req, res) => {
    try {
        const products = await Product.find({})

        res.json({ products })

    } catch (error) {
        console.log("Error in get all product controller", error.message);
        res.status(500).json({ message: "Error in get all product controller", error: error.message });
    }
}


// ok done
export const getFeaturedProduct = async (req, res) => {
    try {

        let featuredProduct = await redis.get("featured_products");
        let DBfeaturedProduct = await Product.find({ isFeatured: true }).lean()

        if (featuredProduct.length !== DBfeaturedProduct.length) {
            await redis.set("featured_products", JSON.stringify(DBfeaturedProduct))
            return res.json(DBfeaturedProduct)
        }
        else {
            return res.json(featuredProduct);
        }

    } catch (error) {
        console.log("Error in featured product controller", error.message);
        res.status(500).json({ message: "Error in featured product controller", error: error.message });

    }
}

// ok done
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, isFeatured } = req.body

        let cloudinaryResponse = null

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
            isFeatured
        })


        res.status(200).json(product)


    } catch (error) {
        console.log("Error in create product controller", error.message);
        res.status(500).json({ message: "Error in create product controller", error: error.message });

    }
}


// ok done
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "product is not found!!" })
        }


        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];

            try {
                await cloudinary.uploader.destroy(`product/${publicId}`)
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.log("error in image delete..", error)
            }
        }

        await Product.findOneAndDelete(req.params.id)

        res.json({ message: "product deleted!!" })

    } catch (error) {
        console.log("Error in del product controller", error.message);
        res.status(500).json({ message: "Error in del product controller : ", error: error.message });
    }

}


export const getrecommendedProduct = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])

        res.json(products)

    } catch (error) {
        console.log("Error in getrecommendedProduct product controller", error.message);
        res.status(500).json({ message: "Error in getrecommendedProduct product controller", error: error.message });

    }
}

// ok done
export const getProductByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const products = await Product.find({ category })

        res.json(products)

    } catch (error) {
        console.log("Error in getProductByCategory product controller", error.message);
        res.status(500).json({ message: "Error in getProductByCategory product controller", error: error.message });

    }
}

// ok done
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (product) {
            product.isFeatured = !product.isFeatured
            const updatedProduct = await product.save();
            await updatedFeaturedProductsCache();
            res.json(updatedProduct)
        }
        else {
            res.status(404).json({ message: "Product not found!!" })
        }

    } catch (error) {
        console.log("Error in toggleFeaturedProduct product controller", error.message);
        res.status(500).json({ message: "Error in toggleFeaturedProduct product controller", error: error.message });

    }

}


// that fetch featured product from db then set in redis
async function updatedFeaturedProductsCache() {
    try {
        const featuredProduct = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProduct))

    } catch (error) {
        console.log("Error in updatedFeaturedProductsCache product controller", error.message);
        res.status(500).json({ message: "Error in updatedFeaturedProductsCache product controller", error: error.message });

    }
}