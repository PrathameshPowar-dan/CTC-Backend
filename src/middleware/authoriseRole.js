const knexConnect = require("../../knexConnection");
const { getAllRoleIds, getUserAllRoles } = require("../controllers/roles/roleHelper");
const { unauthorized, forbidden, badRequest } = require("../utils/errors");


const authorizeRole = (requiredPermissions, mode = "all") => {
    return async (req, res, next) => {
        try {
            // You must have req.user.user_id from JWT/session middleware
            //   const user_id = req.user?.user_id;
            const user_id = 1;

            if (!user_id) {
                return next(unauthorized("User not authenticated"));
            }

            if (!Array.isArray(requiredPermissions)) {
                return next(badRequest("Permissions must be an array"));
            }

            if (requiredPermissions.length === 0) {
                return next(); // No permission check needed
            }

            // 1️⃣ Get user's direct roles
            let roles = await getUserAllRoles(user_id);

            if (roles.length === 0) {
                return next(forbidden("User has no roles assigned"));
            }

            let role_id_main = roles.data.map(r => r.role_id);

            let allRoleIds = await getAllRoleIds(role_id_main);

            const rolePermissions = await knexConnect("permissions")
                .join("role_permissions", "permissions.permission_id", "=", "role_permissions.permission_id")
                .whereIn("role_permissions.role_id", allRoleIds)
                .distinct("permissions.permission_id", "permissions.name");

            let permissionSet = new Set(rolePermissions.map((p) => p.name));

            // ✅ Step 4: Apply user-specific overrides
            const userOverrides = await knexConnect("user_permissions")
                .join("permissions", "permissions.permission_id", "=", "user_permissions.permission_id")
                .where("user_permissions.user_id", user_id)
                .select("permissions.name", "user_permissions.allowed");

            userOverrides.forEach(({ name, allowed }) => {
                if (allowed) permissionSet.add(name);
                else permissionSet.delete(name);
            });

            const hasPermissions = requiredPermissions.map((perm) =>
                permissionSet.has(perm)
            );

            const isAuthorized =
                mode === "all" ? hasPermissions.every(Boolean) : hasPermissions.some(Boolean);

            if (!isAuthorized) {
                return next(forbidden("User don't have required permissions"));
            }
            else {
                // ✅ Access granted
                next();
            }

        } catch (error) {
            console.error("Authorization error:", error);
            return next(unauthorized("Authorization failed"));
        }
    };
};


module.exports = authorizeRole;