import * as React from 'react';
import Linkify from 'react-linkify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';

interface AnnouncementsProps {
    socket: SocketIOClient.Socket;
}

interface AnnouncementsState {
    announcements: string[];
    index: number;
    transitioning: boolean;
}

class Announcements extends React.Component<AnnouncementsProps, AnnouncementsState> {

    private announcementsTimer: number;

    constructor(props: AnnouncementsProps) {
        super(props);

        this.announcementsTimer = window.setInterval(this.cycleAnnouncements, 15000);

        this.state = {
            announcements: [
                'Please make sure your game details are set to "Public"',
                'Testing',
                'What a wondeful test'
            ],
            index: 0,
            transitioning: false
        };
    }

    cycleAnnouncements = () => {
        const newIndex: number = this.state.index + 1 === this.state.announcements.length ? 0 : this.state.index + 1;

        this.setState({
            transitioning: true
        });

        window.setTimeout(
            () => {
                this.setState({ index: newIndex, transitioning: false });
            },
            250
        );
    }

    render() {
        return (
            <div
                id="announcementsHolder"
                onClick={() => {this.cycleAnnouncements(); clearInterval(this.announcementsTimer); }}
            >
                <div id="announcementIcon">
                    <FontAwesomeIcon icon="bullhorn" />
                </div>
                <div id="announcements">
                    <span className={this.state.transitioning ? 'cyclingAnnouncements' : ''}>
                        <Linkify properties={{ target: 'blank' }}>
                            {this.state.announcements[this.state.index]}
                        </Linkify>
                    </span>
                </div>
            </div>
        );
    }
}

export default Announcements;
