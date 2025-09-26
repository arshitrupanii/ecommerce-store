import Coupon from "../schema/coupon.schema.js"

export const getCoupan = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActivate: true });
        res.json(coupon || null);


    } catch (error) {
        console.log("error in get coupan.");
        return res.status(200).json({ message: "error in get coupan.", error: error.message })
    }
}

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

        res.json({
            message : "Coupon is valid",
            code : coupon.code,
            discountPercentage : coupon.discountPercentage,
        })

    } catch (error) {
        console.log("error in validateCoupan.");
        return res.status(200).json({ message: "error in validateCoupan.", error: error.message })

    }
}