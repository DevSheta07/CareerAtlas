/**
 * Role-based authorization middleware factory.
 * Takes one or more allowed role strings and returns middleware
 * that checks if req.user.role is among the allowed roles.
 *
 * Usage:
 *   router.get('/admin-only', auth, roleCheck('admin'), handler);
 *   router.get('/multi-role', auth, roleCheck('admin', 'coordinator'), handler);
 *
 * @param  {...string} roles - The roles that are permitted to access the route
 * @returns {Function} Express middleware function
 */
const roleCheck = (...roles) => {
  return (req, res, next) => {
    // Ensure auth middleware has run and attached req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in first.',
      });
    }

    // Check if the user's role is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource requires one of the following roles: ${roles.join(', ')}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

module.exports = roleCheck;
