import React from 'react';

import './style.scss';
import 'reaviz/dist/index.css';
import HttpClient from '../../common/HttpClient';
import { ProfileViewModel } from '../../../../Common/ViewModels/ProfileViewModel';
import LoadingDots from '../LoadingDots';
import RecentMatches from './RecentMatches';
import ProfileStatistics from './ProfileStatistics';
import SteamID from '../../../../Common/Types/SteamID';

interface ProfileProps {
	steamid: SteamID;
}

interface ProfileState {
	loading: boolean;
	profile?: ProfileViewModel;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
	http: HttpClient;

	constructor(props: ProfileProps) {
		super(props);

		this.state = {
			loading: true
		};

		this.http = new HttpClient();
	}

	componentDidMount() {
		this.getPlayerData();
	}

	getPlayerData = async () => {
		this.setState({
			loading: true
		});

		const profile: ProfileViewModel = await this.http.get(`/profile/${this.props.steamid}`);

		this.setState({
			loading: false,
			profile
		});
	};

	render() {
		return this.state.profile ? (
			<main>
				<div className="profileWindow">
					<div className="profile">
						<div className="identity">
							<a
								href={`https://steamcommunity.com/profiles/${this.props.steamid}`}
								style={{
									backgroundImage: `url('${this.state.profile.avatarUrl}')`
								}}
								className="profilePicture"
								target="_blank"
								rel="noopener noreferrer"
							/>
							<div className="profileInfo">
								<div className="alias">{this.state.profile.alias}</div>
								<div className="quickLinks">
									<a
										className="quickLink"
										href={`https://steamcommunity.com/profiles/${this.props.steamid}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>Steam</span>
									</a>
									<a
										className="quickLink"
										href={`https://logs.tf/profile/${this.props.steamid}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>Logs.tf</span>
									</a>
									<a
										className="quickLink"
										href={`https://demos.tf/profiles/${this.props.steamid}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>Demos.tf</span>
									</a>
									<a
										className="quickLink"
										href={`http://hl.rgl.gg/Public/PlayerProfile.aspx?p=${this.props.steamid}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>RGL.gg</span>
									</a>
									<a
										className="quickLink"
										href={`https://etf2l.org/search/${this.props.steamid}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>ETF2L</span>
									</a>
									<a
										className="quickLink"
										href={`http://www.ugcleague.com/players_page.cfm?player_id=${this.props.steamid}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>UGC</span>
									</a>
								</div>
							</div>
						</div>
						<ProfileStatistics steamid={this.props.steamid} />
					</div>
					<RecentMatches steamid={this.props.steamid} />
				</div>
			</main>
		) : (
			<main>
				<div className="loadingHolder">
					<LoadingDots />
				</div>
			</main>
		);
	}
}

export default Profile;
