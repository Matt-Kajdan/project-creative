// api/controllers/homeController.js

async function getHomeData(req, res) {
  try {
    const userUid = req.user?.uid; // from Firebase auth middleware

    res.json({
      message: "Home data loaded successfully",
      user: {
        uid: userUid || null,
      },
      sample: {
        welcome: "Welcome to your dashboard!",
        status: "Backend, Firebase auth and MongoDB are wired together here.",
      },
    });
  } catch (err) {
    console.error("Error in getHomeData:", err);
    res.status(500).json({ error: "Something went wrong in homeController" });
  }
}

module.exports = { getHomeData };
