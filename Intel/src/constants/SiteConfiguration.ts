import {
	SiteConfigurationModel,
	NavItem,
	SiteBranding
} from '../../../Common/Models/SiteConfigurationModel';
import Gamemode from '../../../Common/Enums/Gamemode';
import GamemodeClassSchemes from '../../../Common/Constants/GamemodeClassSchemes';
import Region from '../../../Common/Enums/Region';
import MatchType from '../../../Common/Enums/MatchType';
import EnvironmentConfigModel from '../../../Common/Models/EnvironmentConfigModel';

const region = Region.NorthAmerica;
const matchType = MatchType.PUG;
const gamemode = Gamemode.Highlander;
const gamemodeClassSchemes = GamemodeClassSchemes.get(gamemode);

const branding: SiteBranding = {
	siteName: 'HLPugs.tf',
	siteSubTitle: !(gamemode && region && matchType)
		? 'PUG NA HL'
		: `${matchType.toUpperCase()} ${region.toUpperCase()} ${gamemode.toUpperCase()}`, // PUG NA HL
	logoPath: 'logo.svg'
};

const navigation: NavItem[] = [
	{
		type: 'tab',
		tabConfig: {
			icon: 'gavel',
			iconPrefix: 'fas',
			name: 'Rules',
			link: '/rules',
			external: false
		}
	},
	{
		type: 'tab',
		tabConfig: {
			icon: 'tachometer-alt',
			iconPrefix: 'fas',
			name: 'Overview',
			link: '/overview',
			external: false
		}
	},
	{
		type: 'divider'
	},
	{
		type: 'tab',
		tabConfig: {
			icon: 'microphone',
			iconPrefix: 'fas',
			name: 'Mumble',
			link: 'mumble://hlpugs.tf',
			external: true
		}
	},
	{
		type: 'tab',
		tabConfig: {
			icon: 'discord',
			iconPrefix: 'fab',
			name: 'Discord',
			link: 'https://discord.gg/rwXy3rq',
			external: true
		}
	},
	{
		type: 'tab',
		tabConfig: {
			icon: 'patreon',
			iconPrefix: 'fab',
			name: 'Patreon',
			link: 'https://patreon.com/hlpugs',
			external: true
		}
	},
	{
		type: 'divider'
	},
	{
		type: 'module',
		moduleConfig: {
			name: 'Captain',
			moduleName: 'Captain'
		}
	},
	{
		type: 'module',
		moduleConfig: {
			name: 'Pre-Ready',
			moduleName: 'PreReady'
		}
	}
];

export const EnvironmentConfig: EnvironmentConfigModel = {
	matchType,
	region,
	gamemode,
} 

export const SiteConfiguration: SiteConfigurationModel = {
	branding,
	navigation,
	gamemodeClassSchemes,
	environmentConfig: EnvironmentConfig
};
