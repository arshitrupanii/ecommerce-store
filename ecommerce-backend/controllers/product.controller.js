import { redis } from "../lib/redis.js";
import Product from "../schema/product.schema.js"
import cloudinary from "../lib/cloudinary.js"


// ok done
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).lean();

        return res.status(200).json({ products })

    } catch (error) {
        console.log("Error in get all product controller : ", error);
        return res.status(500).json({ message: "Error in get All product" });
    }
}


// ok done
export const getFeaturedProduct = async (req, res) => {
    try {

        let featuredProduct = await redis.get("featured_products");
        let DBfeaturedProduct = await Product.find({ isFeatured: true }).lean()

        if (featuredProduct.length !== DBfeaturedProduct.length) {
            await redis.set("featured_products", JSON.stringify(DBfeaturedProduct))
            return res.status(200).json(DBfeaturedProduct)
        }
        else {
            return res.status(200).json(featuredProduct);
        }

    } catch (error) {
        console.log("Error in featured product controller : ", error);
        res.status(500).json({ message: "Error in featured product" });
    }
}

// ok done
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, isFeatured } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "All field required" })
        }

        const existingProduct = await Product.findOne({ name }).lean();

        if (existingProduct) {
            return res.status(400).json({ message: "Product already exist" });
        }

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
            isFeatured: isFeatured ? isFeatured : false
        })

        return res.status(200).json(product)

    } catch (error) {
        console.log("Error in create product controller : ", error);
        return res.status(500).json({ message: "Error in create product" });

    }
}


// ok done
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).lean();

        if(!id){
            return res.status(400).json({message : "id not found"})
        }

        if (!product) {
            return res.status(404).json({ message: "product is not found!!" })
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];

            try {
                await cloudinary.uploader.destroy(`product/${publicId}`)
            } catch (error) {
                console.log("error in image delete : ", error)
            }
        }

        await Product.findOneAndDelete(id)

        return res.status(200).json({ message: "product deleted." })

    } catch (error) {
        console.log("Error in del product controller : ", error);
        return res.status(500).json({ message: "Error delete product" });
    }
}

// ok done
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
        ]);

        return res.status(200).json(products)

    } catch (error) {
        console.log("Error in getrecommendedProduct controller : ", error);
        return res.status(500).json({ message: "Error Recommended product" });
    }
}

// ok done
export const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const products = await Product.find({ category }).lean();

        return res.status(200).json(products)

    } catch (error) {
        console.log("Error in getProductByCategory product controller : ", error);
        return res.status(500).json({ message: "Error in get Product By Category" });
    }
}

// ok done
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);

        if (product) {
            product.isFeatured = !product.isFeatured
            const updatedProduct = await product.save();
            await updatedFeaturedProductsCache();
            return res.status(200).json(updatedProduct)
        }
        else {
            return res.status(404).json({ message: "Product not found!!" })
        }

    } catch (error) {
        console.log("Error in toggleFeaturedProduct product controller", error);
        return res.status(500).json({ message: "Error toggle Featured Product" });
    }
}


// that fetch featured product from db then set in redis
async function updatedFeaturedProductsCache() {
    try {
        const featuredProduct = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProduct))

    } catch (error) {
        console.log("Error in updatedFeaturedProductsCache product controller", error);
        res.status(500).json({ message: "Error in updated Featured Products Cache" });
    }
}