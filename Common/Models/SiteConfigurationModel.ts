import GamemodeClassScheme from './GamemodeClassScheme';
import EnvironmentConfigModel from '../Models/EnvironmentConfigModel';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';

export interface SiteConfigurationModel {
	branding: SiteBranding;
	navigation: NavItem[];
	gamemodeClassSchemes: GamemodeClassScheme[];
	environmentConfig: EnvironmentConfigModel;
}

export interface SiteBranding {
	siteName: string;
	siteSubTitle: string;
	logoPath: string;
}

export interface NavItem {
	type: 'tab' | 'divider' | 'module' | 'function';
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
	functionConfig?: {
		icon: any;
		iconPrefix: any;
		name: string;
		function: () => void;
	};
}
