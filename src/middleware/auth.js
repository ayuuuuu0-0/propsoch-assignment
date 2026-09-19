// We just read user_id from the request header "x-user-id"
// and attach it to req.userId for controllers to use.

const authenticate = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Missing x-user-id header. Please provide a user ID.",
    });
  }

  req.userId = userId; // now every controller can access req.userId
  next();
};

module.exports = { authenticate };
