import React from 'react';
import { SiteConfigurationModel } from '../../../../Common/Models/SiteConfigurationModel';
import Header from '../../components/Header';
import User from '../../components/User';
import Navigation from '../../components/Navigation';
import Settings from '../../components/Settings';
import './style.scss';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';

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

	toggleSettings = () => {
		this.setState({
			settingsOpen: !this.state.settingsOpen
		});
	};

	render() {
		return (
			<div id="Admin">
				<Header
					siteName={this.props.configuration.branding.siteName}
					siteSubTitle={this.props.configuration.branding.siteSubTitle}
					logoPath={this.props.configuration.branding.logoPath}
				/>
				<User currentPlayer={this.props.currentPlayer} settingsOnClick={this.toggleSettings} />
				<Navigation navigationGroup={this.props.configuration.navigation} />
				<Settings
					visibility={this.state.settingsOpen}
					socket={this.props.socket}
					classes={this.props.configuration.gamemodeClassSchemes}
					settingsOnClick={this.toggleSettings}
					userAlias={this.props.currentPlayer.alias}
					settings={this.props.currentPlayer.settings}
				/>
			</div>
		);
	}
}

export default Admin;
