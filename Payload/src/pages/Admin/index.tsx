import React from 'react';
import { SiteConfigurationModel, NavItem } from '../../../../Common/Models/SiteConfigurationModel';
import Header from '../../components/Header';
import User from '../../components/User';
import Navigation from '../../components/Navigation';
import Settings from '../../components/Settings';
import './style.scss';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import { Route } from 'react-router';

import PrivilegeRankings from '../../../../Intel/src/constants/PrivilegeRankings';
import PermissionGroup from '../../../../Common/Enums/PermissionGroup';

interface AdminProps {
	socket: SocketIOClient.Socket;
	configuration: SiteConfigurationModel;
	currentPlayer: PlayerViewModel;
}

interface AdminState {
	settingsOpen: boolean;
}

class Admin extends React.Component<AdminProps, AdminState> {
	constructor(props: AdminProps) {
		super(props);

		this.state = {
			settingsOpen: false
		};
	}

	adminPages: { permissionValue: number; navItem: NavItem }[] = [
		{
			permissionValue: PrivilegeRankings[PermissionGroup.ADMIN],
			navItem: {
				type: 'tab',
				tabConfig: {
					icon: 'user',
					iconPrefix: 'fas',
					name: 'Roles',
					link: '/admin/roles',
					external: false
				}
			}
		},
		{
			permissionValue: PrivilegeRankings[PermissionGroup.ADMIN],
			navItem: {
				type: 'tab',
				tabConfig: {
					icon: 'gamepad',
					iconPrefix: 'fas',
					name: 'Games',
					link: '/admin/games',
					external: false
				}
			}
		},
		{
			permissionValue: PrivilegeRankings[PermissionGroup.ADMIN],
			navItem: {
				type: 'tab',
				tabConfig: {
					icon: 'bullhorn',
					iconPrefix: 'fas',
					name: 'Announcements',
					link: '/admin/announcements',
					external: false
				}
			}
		},
		{
			permissionValue: PrivilegeRankings[PermissionGroup.MODERATOR],
			navItem: {
				type: 'tab',
				tabConfig: {
					icon: 'gavel',
					iconPrefix: 'fas',
					name: 'Punishments',
					link: '/admin/punishments',
					external: false
				}
			}
		},
		{
			permissionValue: PrivilegeRankings[PermissionGroup.MODERATOR],
			navItem: {
				type: 'tab',
				tabConfig: {
					icon: 'user-secret',
					iconPrefix: 'fas',
					name: 'Alts',
					link: '/admin/alts',
					external: false
				}
			}
		}
	];

	toggleSettings = () => {
		this.setState({
			settingsOpen: !this.state.settingsOpen
		});
	};

	getNavigationGroup = (): NavItem[] => {
		const playerPermissionValue = PrivilegeRankings[this.props.currentPlayer.permissionGroup];
		return this.adminPages
			.filter(p => p.permissionValue <= playerPermissionValue)
			.map(p => p.navItem);
	};

	render() {
		return (
			<div id="Admin">
				<Header
					siteName={this.props.configuration.branding.siteName}
					siteSubTitle={this.props.configuration.branding.siteSubTitle}
					logoPath={this.props.configuration.branding.logoPath}
				/>
				<User socket={this.props.socket} currentPlayer={this.props.currentPlayer} settingsOnClick={this.toggleSettings} />
				<Navigation navigationGroup={this.getNavigationGroup()} />
				<Settings
					visibility={this.state.settingsOpen}
					socket={this.props.socket}
					classes={this.props.configuration.gamemodeClassSchemes}
					settingsOnClick={this.toggleSettings}
					userAlias={this.props.currentPlayer.alias}
					steamid={this.props.currentPlayer.steamid}
				/>
				<Route path={'/admin/roles'} render={() => <span>roles</span>} />
				<Route path={'/admin/games'} render={() => <span>games</span>} />
				<Route path={'/admin/announcements'} render={() => <span>announcements</span>} />
				<Route path={'/admin/punishments'} render={() => <span>punishments</span>} />
				<Route path={'/admin/alts'} render={() => <span>alts</span>} />
			</div>
		);
	}
}

export default Admin;
