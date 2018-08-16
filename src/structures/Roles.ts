
export type Role = 'developer' | 'patron' | 'voiceActor';

export type StaffRole = 'admin' | 'mod' | 'headAdmin';

export function isRole(role: StaffRole | Role | 'isLeagueAdmin') {
  return role === 'developer' || 'patron' || 'voiceActor';
}
