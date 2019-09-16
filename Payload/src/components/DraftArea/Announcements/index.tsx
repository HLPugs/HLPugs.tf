import React from 'react';
import Linkify from 'react-linkify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import HomepageAnnouncementViewModel from '../../../../../Common/ViewModels/HomepageAnnouncementViewModel';

interface AnnouncementsProps {
	socket: SocketIOClient.Socket;
}

interface AnnouncementsState {
	announcements: HomepageAnnouncementViewModel[];
	index: number;
	transitioning: boolean;
}

class Announcements extends React.Component<AnnouncementsProps, AnnouncementsState> {
	private announcementsTimer: number;

	constructor(props: AnnouncementsProps) {
		super(props);

		this.props.socket.emit('getHomepageAnnouncements');

		this.props.socket.on('getHomepageAnnouncements', (announcements: HomepageAnnouncementViewModel[]) => {
			this.setState({ announcements });
		});

		this.announcementsTimer = window.setInterval(this.cycleAnnouncements, 15000);

		this.state = {
			announcements: [],
			index: 0,
			transitioning: false
		};
	}

	cycleAnnouncements = () => {
		if (this.state.announcements.length > 1) {
			const newIndex: number = this.state.index + 1 === this.state.announcements.length ? 0 : this.state.index + 1;

			this.setState({
				transitioning: true
			});

			window.setTimeout(() => {
				this.setState({ index: newIndex, transitioning: false });
			}, 250);
		}
	};

	render() {
		if (this.state.announcements.length) {
			return (
				<div
					id="announcementsHolder"
					onClick={() => {
						this.cycleAnnouncements();
						clearInterval(this.announcementsTimer);
					}}
				>
					<div id="announcementIcon">
						<FontAwesomeIcon icon="bullhorn" />
					</div>
					<div id="announcements">
						<span className={this.state.transitioning ? 'cyclingAnnouncements' : ''}>
							<Linkify properties={{ target: 'blank' }}>
								{this.state.announcements[this.state.index].messageContent}
							</Linkify>
						</span>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default Announcements;
