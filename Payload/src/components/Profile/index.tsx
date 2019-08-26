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

import { BarChart, Bar, XAxis, YAxis, Tooltip, TooltipPayload } from 'recharts';

const data = [
	{
		TFClass: 'Scout',
		wins: 246,
		ties: 20,
		losses: 274
	},
	{
		TFClass: 'Soldier',
		wins: 85,
		ties: 8,
		losses: 93
	},
	{
		TFClass: 'Pyro',
		wins: 26,
		ties: 2,
		losses: 24
	},
	{
		TFClass: 'Demoman',
		wins: 174,
		ties: 14,
		losses: 186
	},
	{
		TFClass: 'Heavy',
		wins: 31,
		ties: 4,
		losses: 32
	},
	{
		TFClass: 'Engineer',
		wins: 26,
		ties: 2,
		losses: 29
	},
	{
		TFClass: 'Medic',
		wins: 8,
		ties: 1,
		losses: 19
	},
	{
		TFClass: 'Sniper',
		wins: 33,
		ties: 3,
		losses: 50
	},
	{
		TFClass: 'Spy',
		wins: 28,
		ties: 2,
		losses: 29
	}
];

interface ProfileProps {
	steamid: string;
}

interface ProfileState {
	loading: boolean;
	matchesPage: number;
	matchesPageSize: number;
	player?: ProfileViewModel;
	matches?: ProfilePaginatedMatchesViewModel;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
	http: HttpClient;

	constructor(props: ProfileProps) {
		super(props);

		this.state = {
			loading: true,
			matchesPage: 0,
			matchesPageSize: 5
		};

		this.http = new HttpClient();
	}

	componentDidMount() {
		this.getPlayerData();
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
		return this.state.player && this.state.matches ? (
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
							<BarChart
								width={600}
								height={400}
								reverseStackOrder={true}
								data={data}
							>
								<XAxis
									dataKey="TFClass"
									tickSize={0}
									tickFormatter={() => null}
									tick={renderClassAxisTick}
								/>
								<YAxis />
								{/* 
                // @ts-ignore */}
								<Tooltip
									cursor={{ fill: 'var(--background)' }}
									contentStyle={{
										background: 'var(--background-light)',
										borderRadius: 4,
										border: 'none',
										boxShadow: 'var(--paper-1)'
									}}
									formatter={(value, prop: string) => [
										value,
										prop.charAt(0).toUpperCase() + prop.slice(1)
									]}
									itemSorter={(payload: TooltipPayload) =>
										-payload.name.charCodeAt(0)
									}
								/>
								<Bar dataKey="wins" stackId="a" fill="#4caf50" />
								<Bar dataKey="ties" stackId="a" fill="#ffeb3b" />
								<Bar dataKey="losses" stackId="a" fill="#f44336" />
							</BarChart>
						</div>
					</div>
					<div className="matches">
						<div className="title">Recent Matches</div>
						<div className="matchHolder">
							{this.state.matches.matches.map(match => (
								<div key={match.id} className="match">
									<div
										className="map"
										style={{
											backgroundImage: `url('/img/maps/${match.map}.jpg')`
										}}
									/>
									<div className="matchDetail">
										<div>
											<span>Soldier {match.id}</span>
											<span>{match.map}</span>
										</div>
										<div>
											<span>{moment(match.date).fromNow()}</span>
											<span>{match.winningTeam}</span>
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

const renderClassAxisTick = ({
	x,
	y,
	payload
}: {
	x: number;
	y: number;
	payload: { value: DraftTFClass };
}) => {
	return (
		<svg x={x - 16} y={y + 4} width={32} height={32}>
			<ClassIcon name={payload.value} />
		</svg>
	);
};

export default Profile;
