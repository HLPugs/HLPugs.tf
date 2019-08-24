import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';

export interface SiteConfiguration {
  branding: SiteBranding;
  navigation: NavItem[];
  classes: DraftTFClassList[];
}

export interface SiteBranding {
  siteName: string;
  siteSubTitle: string;
  logoPath: string;
}

export interface NavItem {
  type: 'tab' | 'divider' | 'module';
  tabConfig?: {
    icon: IconName;
    iconPrefix: IconPrefix;
    name: string;
    link: string;
    external: boolean;
  };
  moduleConfig?: {
    name: string;
    moduleName: string;
  };
}

export interface DraftTFClassList {
  name: DraftTFClass;
  numberPerTeam: number;
}

interface SettingsViewModel {
	id: number;
	isNotifiableByMention: boolean;
	volume: number;
	favoriteClasses: DraftTFClass[];
	addToFavoritesAfterMatch: boolean;
	addToFavoritesOnLogin: boolean;
	audioCuesEnabled: boolean;
	voicepack: string;
	colorOfNameInChat: string;
}
export interface UserViewModel {
  loggedIn?: boolean;
  alias?: string;
  steamid?: string;
  avatarUrl?: string;
  settings?: any;
}

export interface ChatMessageType {
  username: string;
  userid: string;
  id: string;
  timestamp: number;
  message: string;
}

export interface PreDraftRequirementType {
  name: string;
  state: boolean;
}

export interface CompletionItem {
  name?: string;
  customName?: string;
  url?: string;
}

export type region = 'na' | 'eu' | 'all';

export interface BasicAnnouncement {
  content: string;
  priority: boolean;
}

export interface FullAnnouncement extends BasicAnnouncement {
  id: number;
  region: region;
  creator: string;
  timestamp: Date;
}
