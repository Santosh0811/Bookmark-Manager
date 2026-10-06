const bcrypt = require('bcrypt');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser.js');
const bookmarkSchema = require('../model/bookmark.js');
const signupSchema = require('../model/Signup.js');

router.get('/readBookmark', fetchUser, async (req, res) => {
    try {
        const user = await signupSchema.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).json({ message: "Login Required" });
        }

        const fetchBookmark = await bookmarkSchema.findOne({ userId: user.userId });

        if (!fetchBookmark) {
            return res.status(404).json({ message: "No Bookmarks Found", bookmarks: [] });
        }

        return res.status(200).json({ message: "Bookmark Fetched Successfully", bookmarks: fetchBookmark.bookmarks });
    } catch (error) {
        console.error("Error while showing bookmark:", error);
        return res.status(500).json({ message: "Error while Showing Bookmark" });
    }
});

router.post('/createBookmark', fetchUser, async (req, res) => {
    try {
        const user = await signupSchema.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).json({ message: "Login Required" });
        }

        const { siteName, siteURL, siteLogo } = req.body;

        if (!siteName || !siteURL) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingBookmark = await bookmarkSchema.findOne({ userId: user.userId });

        if (existingBookmark) {
            await bookmarkSchema.findOneAndUpdate({ userId: user.userId }, { $push: { bookmarks: { siteName, siteURL, siteLogo } } }, { new: true });
        } else {
            await bookmarkSchema.create({ userId: user.userId, userName: user.userName, email: user.email, bookmarks: [{ siteName, siteURL, siteLogo }] });
        }

        return res.status(201).json({ message: "Bookmark saved successfully" });
    } catch (error) {
        console.error("Error while saving bookmark:", error);

        return res.status(500).json({ message: "Error while Saving Bookmark" });
    }
});

router.put('/updateBookmark/:id', fetchUser, async (req, res) => {
    try {
        const user = await signupSchema.findOne({ userId: req.userId });

        if (!user) {
            return res.status(401).json({ message: "Login Required" });
        }

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Id not found" });
        }

        const { siteName, siteURL, siteLogo } = req.body;

        if (!siteName || !siteURL || !siteLogo) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const updatedBookmark = await bookmarkSchema.findOneAndUpdate(
            {
                userId: user.userId,
                "bookmarks._id": id
            },
            {
                $set:
                {
                    "bookmarks.$.siteName": siteName,
                    "bookmarks.$.siteURL": siteURL,
                    "bookmarks.$.siteLogo": siteLogo
                }
            }, { new: true });

        if (!updatedBookmark) {
            return res.status(404).json({ message: "Bookmark not found" });
        }

        return res.status(200).json({ message: "Bookmark Updated Successfully" });
    } catch (error) {
        console.error("Error while Updating the Bookmark", error);
        return res.status(500).json({ message: "Error while Updating Bookmark" });
    }
});

router.delete('/deleteBookmark/:id', fetchUser, async (req, res) => {
    try {
        const user = await signupSchema.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).json({ message: "Login Required" });
        }

        const { id } = req.params;

        const deletedBookmark = await bookmarkSchema.findOneAndUpdate(
            {
                userId: user.userId
            },
            {
                $pull: {
                    bookmarks: {
                        _id: id
                    }
                }
            },
            { new: true }
        );

        if (!deletedBookmark) {
            return res.status(404).json({ message: "Bookmark not Deleted" });
        }

        return res.json({ message: "Bookmark deleted successfully" });
    } catch (error) {
        console.error("Error while Deleting Bookmark", error);
        res.status(500).json({ message: "Error while Deleting Bookmark" });
    }
})

router.put('/changePasswordInside', fetchUser, async (req, res) => {
    try {
        const user = await signupSchema.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).json({ message: "Login Required" });
        }

        const { currentPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Current Password is not correct" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const passwordUpdated = await user.updateOne({ password: hashedPassword }, { new: true });

        if (!passwordUpdated) {
            return res.status(400).json({ message: "failed to change password" });
        }

        return res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
        console.error("Error while Changing Password:", error);
        res.status(500).json({ message: "Error while Changing Password" });
    }
})

module.exports = router;