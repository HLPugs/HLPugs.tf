export const addRoleQuery = `UPDATE PLAYERS set roles = array_remove(roles, $1);
UPDATE PLAYERS SET roles = array_append(roles, $1);
`;
