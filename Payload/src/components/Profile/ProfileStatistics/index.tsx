import React from 'react';

import './style.scss';
import HttpClient from '../../../common/HttpClient';
import Region from '../../../../../Common/Enums/Region';
import Gamemode from '../../../../../Common/Enums/Gamemode';
import MatchType from '../../../../../Common/Enums/MatchType';
import ProfileClassStatisticsViewModel from '../../../../../Common/ViewModels/ProfileClassStatisticsViewModel';
import {
	StackedBarChart,
	StackedBarSeries,
	Bar,
	Gradient,
	GradientStop
} from 'reaviz';
import LoadingDots from '../../LoadingDots';
import EnvironmentConfigModel from '../../../../../Common/Models/EnvironmentConfigModel';

interface ProfileStatisticsProps {
	steamid: string;
}

interface ProfileStatisticsState {
	region: Region | 'all';
	gamemode: Gamemode;
	matchType: MatchType | 'all';
	classStats?: ProfileClassStatisticsViewModel;
}

class ProfileStatistics extends React.Component<
	ProfileStatisticsProps,
	ProfileStatisticsState
> {
	http: HttpClient;

	constructor(props: ProfileStatisticsProps) {
		super(props);

		this.state = {
			region: Region.NorthAmerica,
			gamemode: Gamemode.Highlander,
			matchType: MatchType.PUG
		};

		this.http = new HttpClient();
	}

	componentDidMount() {
		this.getClassStatistics();
	}

	getClassStatistics = async () => {
		let filters = '';

		for (const filter in this.state) {
			if (filter === 'classStats') continue;

			const val = this.state[filter as keyof ProfileStatisticsState];

			if (val !== 'all') {
				filters += `&${filter}=${val}`;
			}
		}

		const classStats: ProfileClassStatisticsViewModel = await this.http.get(
			`/profile/${this.props.steamid}/classStatistics?${filters}`
		);

		this.setState({
			classStats
		});
	};

	getTotalMatches = () => {
		if (this.state.classStats) {
			const {
				totalWinCount,
				totalTieCount,
				totalLossCount
			} = this.state.classStats;

			return totalWinCount + totalTieCount + totalLossCount;
		} else {
			return 0;
		}
	};

	handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
		const target = e.target as HTMLSelectElement;
		const value = target.value;
		const name = target.name as keyof ProfileStatisticsState;

		this.setState(
			({
				[name]: value
			} as unknown) as Pick<
				ProfileStatisticsState,
				keyof ProfileStatisticsState
			>,
			this.getClassStatistics
		);
	};

	render() {
		return this.state.classStats ? (
			<div className="statistics">
				<div className="filters">
					<select
						value={this.state.region}
						name="region"
						onChange={this.handleChange}
					>
						<option value="all">All</option>
						<option value={Region.NorthAmerica}>NA</option>
						<option value={Region.Europe}>EU</option>
					</select>
					<select
						value={this.state.matchType}
						name="matchType"
						onChange={this.handleChange}
					>
						<option value="all">All</option>
						<option value={MatchType.PUG}>PUG</option>
						<option value={MatchType.MIX}>Mix</option>
					</select>
					<select
						value={this.state.gamemode}
						name="gamemode"
						onChange={this.handleChange}
					>
						<option value={Gamemode.Highlander}>Highlander</option>
						<option value={Gamemode.Sixes}>Sixes</option>
						<option value={Gamemode.Prolander}>Prolander</option>
						<option value={Gamemode.Fours}>Fours</option>
						<option value={Gamemode.Ultiduo}>Ultiduo</option>
					</select>
				</div>
				<div className="totals">
					<span>Matches: {this.getTotalMatches()}</span>
					<span>Wins: {this.state.classStats.totalWinCount}</span>
					<span>Ties: {this.state.classStats.totalTieCount}</span>
					<span>Losses: {this.state.classStats.totalLossCount}</span>
				</div>
				<div className="statChart">
					<StackedBarChart
						data={this.state.classStats.statistics}
						gridlines={null}
						series={
							<StackedBarSeries
								colorScheme={['#f44336', '#ffeb3b', '#4caf50']}
								bar={
									<Bar
										gradient={
											<Gradient
												stops={[<GradientStop stopOpacity={1} key="start" />]}
											/>
										}
										rounded={false}
									/>
								}
							/>
						}
					/>
				</div>
			</div>
		) : (
			<LoadingDots />
		);
	}
}

export default ProfileStatistics;
