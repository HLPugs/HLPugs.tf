import { region } from './region';

export interface announcement {
  id: number;
  region: region;
  content: string;
  creator: string;
  priority: boolean;
  timestamp?: Date;
}
