export function getUserRoles(user) {
  if (!user) return [];

  const roles = Array.isArray(user.roles) ? user.roles : [];
  const normalizedRoles = roles
    .map((role) => (typeof role === "string" ? role : role?.name))
    .filter(Boolean)
    .map((role) => role.toUpperCase());

  if (user.role) normalizedRoles.push(String(user.role).toUpperCase());

  return [...new Set(normalizedRoles)];
}

export function hasRole(user, role) {
  return getUserRoles(user).includes(String(role).toUpperCase());
}
