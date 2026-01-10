const User = require("../models/user");
const Quiz = require("../models/quiz");
const Friend = require("../models/friend");
const admin = require("../lib/firebaseAdmin");

const PLACEHOLDER_AUTH_ID = "deleted-user";
const PLACEHOLDER_USERNAME = "Deleted user";
const PLACEHOLDER_EMAIL = "deleted@quiz.invalid";
const DEFAULT_MODE = "delete_quizzes";

async function getDeletedUserPlaceholder() {
  const placeholder = await User.findOneAndUpdate(
    { authId: PLACEHOLDER_AUTH_ID },
    {
      $setOnInsert: {
        authId: PLACEHOLDER_AUTH_ID,
        username: PLACEHOLDER_USERNAME,
        email: PLACEHOLDER_EMAIL,
        status: "active",
        is_placeholder: true
      },
      $set: {
        is_placeholder: true
      }
    },
    { new: true, upsert: true }
  );

  return placeholder;
}

async function removeUserAttempts(userId) {
  await Quiz.updateMany(
    { "attempts.user_id": userId },
    { $pull: { attempts: { user_id: userId } } }
  );
}

async function removeUserFriends(userId) {
  await Friend.deleteMany({
    $or: [{ user1: userId }, { user2: userId }]
  });
}

async function removeQuizzesFromFavourites(quizIds) {
  if (!quizIds.length) return;
  await User.updateMany(
    { favourites: { $in: quizIds } },
    { $pull: { favourites: { $in: quizIds } } }
  );
}

async function deleteFirebaseAuthUser(authId) {
  if (!authId) return;
  if (process.env.NODE_ENV === "test") return;
  try {
    await admin.auth().deleteUser(authId);
  } catch (error) {
    console.error("Failed to delete Firebase auth user:", error);
  }
}

async function executeUserDeletion(user, modeOverride) {
  if (!user) {
    throw new Error("User not found");
  }
  if (user.is_placeholder) {
    throw new Error("Cannot delete placeholder user");
  }

  const userId = user._id;
  const authId = user.authId;
  const deletionMode = modeOverride || user.deletion?.mode || DEFAULT_MODE;

  const createdQuizzes = await Quiz.find({ created_by: userId }).select("_id");
  const createdQuizIds = createdQuizzes.map((quiz) => quiz._id);

  if (deletionMode === "preserve_quizzes") {
    const placeholder = await getDeletedUserPlaceholder();
    await Quiz.updateMany(
      { created_by: userId },
      { $set: { created_by: placeholder._id } }
    );
  } else {
    if (createdQuizIds.length) {
      await Quiz.deleteMany({ created_by: userId });
      await removeQuizzesFromFavourites(createdQuizIds);
    }
  }

  await removeUserAttempts(userId);
  await removeUserFriends(userId);
  await User.deleteOne({ _id: userId });
  await deleteFirebaseAuthUser(authId);
}

async function runDueDeletions() {
  const now = new Date();
  const dueUsers = await User.find({
    status: "pending_deletion",
    "deletion.scheduled_for": { $lte: now },
    is_placeholder: { $ne: true }
  });

  if (dueUsers.length === 0) return { processed: 0 };

  const results = await Promise.allSettled(
    dueUsers.map((user) => executeUserDeletion(user))
  );

  const processed = results.filter((result) => result.status === "fulfilled").length;
  return { processed };
}

module.exports = {
  getDeletedUserPlaceholder,
  executeUserDeletion,
  runDueDeletions
};
