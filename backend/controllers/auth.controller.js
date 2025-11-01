import User from "../schema/user.schema.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";


const generateTokens = (userId) => {
    try {
        const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });

        const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "7d",
        });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log("error in generate token : ", error)
        return res.status(500).json({ message: "Something went wrong." })
    }
};

const storeRefreshToken = async (userId, refreshToken) => {
    try {
        await redis.set(`refresh_token:${userId}`, refreshToken, { ex: 7 * 24 * 60 * 60 }); // 7days
    } catch (error) {
        console.log("error in store refresh token ", error)
        return res.status(500).json({ message: "Something went wrong." })
    }
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};


// ok done
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and Password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email Address" });
        }

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user.id);
            await storeRefreshToken(user.id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            return res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });

        }
        else {
            return res.status(400).json({ message: "Invalid password" });
        }

    } catch (error) {
        console.log("Error in login controller : ", error);
        return res.status(500).json({ message: "Login failed" });
    }

}

// ok done
export const signup = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All field are required" });
        }

        const existingUser = await User.findOne({ email }).lean();

        if (existingUser) {
            return res.status(400).json({ message: "User already exist." })
        }

        const user = await User.create({ name, email, password })

        const { accessToken, refreshToken } = generateTokens(user.id);
        await storeRefreshToken(user.id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        return res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        console.log("Error in signup controller : ", error);
        return res.status(500).json({ message: "Signup failed" });
    }
}

// ok done
export const logout = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${decoded.userId}`)
        }

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.status(200).json({ message: "logout successfully..." })

    } catch (error) {
        console.log("Error in logout controller : ", error);
        res.status(500).json({ message: "Logout failed" });
    }
}


// this will refresh the access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ message: "Token refreshed successfully" });

    } catch (error) {
        console.log("Error in refreshToken controller : ", error);
        return res.status(500).json({ message: "Server error"});
    }
};

// ok done
export const getProfile = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
