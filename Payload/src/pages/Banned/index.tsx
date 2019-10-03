import React from 'react';
import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import { SiteConfigurationModel } from '../../../../Common/Models/SiteConfigurationModel';
import GetBannedPageViewModelRequest from '../../../../Common/Requests/GetBannedPageViewModelRequest';
import BannedPageViewModel from '../../../../Common/ViewModels/BannedPageViewModel';
import moment from 'moment';
import './style.scss';
import SteamID from '../../../../Common/Types/SteamID';
import LoadingDots from '../../components/LoadingDots';

interface BannedProps {
	socket: SocketIOClient.Socket;
	configuration: SiteConfigurationModel;
	steamid: SteamID;
}

interface BannedState {
	bannedPageViewModelLoaded: boolean;
	bannedPageViewModel: BannedPageViewModel;
}

class Banned extends React.Component<BannedProps, BannedState> {
	constructor(props: BannedProps) {
		super(props);

		this.state = {
			bannedPageViewModelLoaded: false,
			bannedPageViewModel: new BannedPageViewModel()
		};

		this.props.socket.emit('getBannedPageViewModel', { steamid: this.props.steamid } as GetBannedPageViewModelRequest);

		this.props.socket.on('getBannedPageViewModel', (bannedPageViewModel: BannedPageViewModel) => {
			this.setState({ bannedPageViewModel });
			this.setState({ bannedPageViewModelLoaded: true });
		});
	}

	render() {
		return (
			<div id="Banned">
				<Header
					siteName={this.props.configuration.branding.siteName}
					siteSubTitle={this.props.configuration.branding.siteSubTitle}
					logoPath={this.props.configuration.branding.logoPath}
				/>
				<Navigation navigationGroup={this.props.configuration.navigation} />
				{this.state.bannedPageViewModelLoaded ? (
					<div id="BannedInfo">
						<span>Ban Reason: {this.state.bannedPageViewModel.reason}</span>
						<span>Ban Start: {moment(this.state.bannedPageViewModel.creationDate).format('LLL')}</span>
						<span>Ban End: {moment(this.state.bannedPageViewModel.expirationDate).format('LLL')}</span>
					</div>
				) : null}
			</div>
		);
	}
}

export default Banned;
