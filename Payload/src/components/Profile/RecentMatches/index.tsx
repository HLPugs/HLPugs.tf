import React, { Fragment } from 'react';

import './style.scss';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfilePaginatedMatchesViewModel from '../../../../../Common/ViewModels/ProfilePaginatedMatchesViewModel';
import HttpClient from '../../../common/HttpClient';
import LoadingDots from '../../LoadingDots';
import SteamID from '../../../../../Common/Types/SteamID';

interface RecentMatchesProps {
	steamid: SteamID;
}

interface RecentMatchesState {
	matchesPage: number;
	matchesPageSize: number;
	matches?: ProfilePaginatedMatchesViewModel;
}

class RecentMatches extends React.Component<
	RecentMatchesProps,
	RecentMatchesState
> {
	http: HttpClient;

	constructor(props: RecentMatchesProps) {
		super(props);

		this.state = {
			matchesPage: 0,
			matchesPageSize: 5
		};

		this.http = new HttpClient();
	}

	componentDidMount() {
		this.getMatches();
	}

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
		return (
			<div className="matches">
				<div className="title">Recent Matches</div>
				{this.state.matches ? (
					<Fragment>
						<div className="matchHolder">
							{this.state.matches.matches.map(match => (
								<div
									key={match.id}
									className={`match ${
										match.outcome === 0
											? 'Win'
											: match.outcome === 1
											? 'Loss'
											: 'Tie'
									}`}
								>
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
					</Fragment>
				) : (
					<LoadingDots />
				)}
			</div>
		);
	}
}

export default RecentMatches;
