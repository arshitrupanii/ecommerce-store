import Coupon from "../schema/coupon.schema.js"

// ok done
export const getCoupan = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActivate: true }).lean();
        return res.status(200).json(coupon || null);

    } catch (error) {
        console.log("error in get coupan : ", error);
        return res.status(500).json({ message: "Error in get coupan" })
    }
}

// ok done
export const validateCoupan = async (req, res) => {
    try {

        const { code } = req.params;
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActivate: true });

        if(!coupon){
            return res.status(404).json({message : "Coupon not found!!"})
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActivate = false;
            await coupon.save();
            return res.status(404).json({message : "Coupon Expired!!"})
        }

        return res.status(200).json({
            message : "Coupon is valid",
            code : coupon.code,
            discountPercentage : coupon.discountPercentage,
        })

    } catch (error) {
        console.log("error in validateCoupan : ", error);
        return res.status(500).json({ message: "Error in validateCoupan." })

    }
}