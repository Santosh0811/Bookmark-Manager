const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();
const bookmarkSchema = require('../model/bookmark.js');
const signupSchema = require('../model/Signup.js');

router.get("/bookmarkUserData", adminAuth, async (req, res) => {
    try {
        const users = await signupSchema.find().select("-password");;

        if (users.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "No users found in Bookmark Site" });
        }

        return res.status(200).json({ success: true, data: users, message: `${users.length} users found` });

    } catch (error) {
        console.log("Error while fetching Bookmark User Data", error);
        return res.status(404).json({ success: false, message: "Error while fetching Bookmark User Data" });
    }
})

router.delete("/bookmarkUserDelete/:userId", adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "No user found" });
        }

        const allBookmarks = await bookmarkSchema.deleteMany({ userId });

        if (!allBookmarks) {
            return res.status(404).json({ success: false, message: "All bookmarks are not deleted" });
        }

        const deleteUser = await signupSchema.findOneAndDelete({ userId: userId });

        if (!deleteUser) {
            return res.status(404).json({ success: false, message: "User not deleted" });
        }

        return res.status(200).json({ success: true, message: "User and all related data deleted successfully" });

    } catch (error) {
        console.log("Error while deleting Bookmark User", error);
        return res.status(500).json({ success: false, message: "Error while deleting Bookmark User" });
    }
})

router.get("/bookmarkSiteData/:userId", adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "No user found" });
        }

        const bookmarks = await bookmarkSchema.find({ userId: userId });

        if (bookmarks.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "No bookmarks found in Bookmark Site" });
        }

        return res.status(200).json({ success: true, data: bookmarks, message: `${bookmarks.map(item => item.userName)}'s ${bookmarks.map(item => item.bookmarks.length)} bookmark found` });

    } catch (error) {
        console.log("Error while fetching Bookmark site User bookmarks", error);
        return res.status(404).json({ success: false, message: "Error while fetching Bookmark site User bookmarks" });
    }
})

router.delete("/bookmarkSiteDelete/:userId/:itemId", adminAuth, async (req, res) => {
    try {
        const { userId, itemId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "No user found" });
        }

        if (!itemId) {
            return res.status(400).json({ message: "No item found" });
        }

        const deleteBookmarks = await bookmarkSchema.updateOne({ userId: userId }, { $pull: { bookmarks: { _id: itemId } } });

        if (deleteBookmarks.deletedCount === 0) {
            return res.status(404).json({ message: "Bookmark not found" });
        }

        return res.status(200).json({
            message: "Bookmark deleted successfully"
        });

    } catch (error) {
        console.log("Error while deleteing Bookmark site User bookmarks", error);
        return res.status(500).json({ success: false, message: "Error while deleting Bookmark site User bookmarks" });
    }
})

module.exports = router;