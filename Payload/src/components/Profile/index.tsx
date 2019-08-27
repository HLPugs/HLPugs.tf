import React from 'react';

import './style.scss';
import HttpClient from '../../common/HttpClient';
import { ProfileViewModel } from '../../../../Common/ViewModels/ProfileViewModel';
import LoadingDots from '../LoadingDots';
import ClassIcon from '../ClassIcon';
import DraftTFClass from '../../../../Common/Enums/DraftTFClass';
import ProfilePaginatedMatchesViewModel from '../../../../Common/ViewModels/ProfilePaginatedMatchesViewModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import {
	StackedBarChart,
	StackedBarSeries,
	LinearXAxis,
	LinearXAxisTickLabel
} from 'reaviz';
import ClassStatistics from '../../../../Common/Models/ClassStatistics';
import Region from '../../../../Common/Enums/Region';
import Gamemode from '../../../../Common/Enums/Gamemode';
import MatchType from '../../../../Common/Enums/MatchType';
import statConvert from './statConvert';

const data = [
	{
		key: 'Scout',
		data: [
			{ key: 'Wins', data: 246 },
			{ key: 'Ties', data: 20 },
			{ key: 'Losses', data: 50 }
		]
	},
	{
		key: 'Soldier',
		data: [
			{ key: 'Wins', data: 246 },
			{ key: 'Ties', data: 20 },
			{ key: 'Losses', data: 50 }
		]
	},
	{
		key: 'Pyro',
		data: [
			{ key: 'Wins', data: 246 },
			{ key: 'Ties', data: 20 },
			{ key: 'Losses', data: 50 }
		]
	}
];

interface ProfileProps {
	steamid: string;
}

interface ProfileState {
	loading: boolean;
	statRegion: string;
	statGamemode: string;
	statMatchType: string;
	matchesPage: number;
	matchesPageSize: number;
	player?: ProfileViewModel;
	classStats?: ClassStatistics;
	matches?: ProfilePaginatedMatchesViewModel;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
	http: HttpClient;

	constructor(props: ProfileProps) {
		super(props);

		this.state = {
			loading: true,
			statRegion: 'na',
			statGamemode: 'Highlander',
			statMatchType: 'PUG',
			matchesPage: 0,
			matchesPageSize: 5
		};

		this.http = new HttpClient();
	}

	componentDidMount() {
		this.getPlayerData();
		this.getClassStatistics();
		this.getMatches();
	}

	getPlayerData = async () => {
		this.setState({
			loading: true
		});

		const player = await this.http.get(`/profile/${this.props.steamid}`);

		this.setState({
			loading: false,
			player
		});
	};

	getClassStatistics = async () => {
		const classStats = await this.http.get(
			`/player/${this.props.steamid}/classStatistics?region=${this.state.statRegion}&gamemode=${this.state.statGamemode}&matchtype=${this.state.statMatchType}`
		);

		console.log(statConvert(classStats));

		this.setState({
			classStats
		});
	};

	getMatches = async () => {
		const matches = await this.http.get(
			`/profile/${this.props.steamid}/matches?pageSize=${this.state.matchesPageSize}&currentPage=${this.state.matchesPage}`
		);

		this.setState({
			matches
		});
	};

	changePage = async (delta: number) => {
		const newPage = this.state.matchesPage + delta;
		if (
			newPage >= 0 &&
			newPage < this.state.matches!.totalMatches / this.state.matchesPageSize
		) {
			this.setState(
				{
					matchesPage: this.state.matchesPage + delta
				},
				this.getMatches
			);
		}
	};

	render() {
		return this.state.player && this.state.matches && this.state.classStats ? (
			<main>
				<div className="profileWindow">
					<div className="profile">
						<div className="identity">
							<a
								href={`https://steamcommunity.com/profiles/${this.props.steamid}`}
								style={{
									backgroundImage: `url('${this.state.player.avatarUrl}')`
								}}
								className="profilePicture"
								target="_blank"
								rel="noopener noreferrer"
							/>
							<div className="profileInfo">
								<div className="alias">{this.state.player.alias}</div>
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
						<div>
							<StackedBarChart
								width={600}
								height={350}
								data={statConvert(this.state.classStats)}
								xAxis={<LinearXAxis type="category" />}
								series={<StackedBarSeries />}
							/>
						</div>
					</div>
					<div className="matches">
						<div className="title">Recent Matches</div>
						<div className="matchHolder">
							{this.state.matches.matches.map(match => (
								<div key={match.id} className="match">
									<a
										href={`https://logs.tf/${match.logsId}`}
										target="_blank"
										rel="noopener noreferrer"
										className="logsLink"
									>
										<div
											className="map"
											style={{
												backgroundImage: `url('/img/maps/${match.map}.jpg')`
											}}
										/>
										<div className="logs">
											<FontAwesomeIcon icon="chart-pie" />
											<span>Logs.tf</span>
										</div>
									</a>
									<div className="matchDetail">
										<div>
											<span>
												{match.tf2class}
												{match.wasCaptain ? ' - Captain' : ''}
											</span>
											<span>{match.map}</span>
										</div>
										<div>
											<span>{moment(match.date).fromNow()}</span>
											<span>
												{match.outcome === 0
													? 'Win'
													: match.outcome === 1
													? 'Loss'
													: 'Tie'}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="pagination">
							<div
								className={`${
									this.state.matchesPage === 0 ? 'disabled' : ''
								} pager`}
								onClick={() => this.changePage(-1)}
							>
								<FontAwesomeIcon icon="arrow-left" />
							</div>
							<div className="pages">
								{this.state.matchesPage + 1} /{' '}
								{Math.ceil(
									this.state.matches.totalMatches / this.state.matchesPageSize
								)}
							</div>
							<div
								className={`${
									this.state.matchesPage + 1 ===
									Math.ceil(
										this.state.matches.totalMatches / this.state.matchesPageSize
									)
										? 'disabled'
										: ''
								} pager`}
								onClick={() => this.changePage(1)}
							>
								<FontAwesomeIcon icon="arrow-right" />
							</div>
						</div>
					</div>
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
