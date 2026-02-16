const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access forbidden. Insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Role authorization error.",
      });
    }
  };
};

module.exports = roleMiddleware;
