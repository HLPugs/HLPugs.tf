export type Region = 'na' | 'eu' | 'all';

export interface Announcement {
  id: number;
  region: Region;
  content: string;
  creator: string;
  priority: boolean;
  timestamp?: Date;
}
