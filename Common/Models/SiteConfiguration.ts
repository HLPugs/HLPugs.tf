import GamemodeClassScheme from './GamemodeClassScheme';

export interface SiteConfiguration {
	branding: SiteBranding;
	navigation: NavItem[];
	gamemodeClassSchemes: GamemodeClassScheme[];
}

export interface SiteBranding {
	siteName: string;
	siteSubTitle: string;
	logoPath: string;
}

export interface NavItem {
	type: 'tab' | 'divider' | 'module';
	tabConfig?: {
		icon: any; // change to IconName
		iconPrefix: any; // change to IconPrefix
		name: string;
		link: string;
		external: boolean;
	};
	moduleConfig?: {
		name: string;
		moduleName: string;
	};
}
