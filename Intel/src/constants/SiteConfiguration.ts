import * as dotenv from 'dotenv';
import {
	SiteConfiguration as SiteConfigurationModel,
	NavItem,
	SiteBranding
} from '../../../Common/Models/SiteConfiguration';
import Gamemode from '../../../Common/Enums/Gamemode';
import GamemodeClassSchemes from '../../../Common/Constants/GamemodeClassSchemes';

const currentGamemode = process.env.gamemode as Gamemode;
const gamemodeClassSchemes = GamemodeClassSchemes.get(currentGamemode);

const env = dotenv.config().parsed;

const { gamemode, region, matchType } = env;

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

export const SiteConfiguration: SiteConfigurationModel = {
	branding,
	navigation,
	gamemodeClassSchemes
};
