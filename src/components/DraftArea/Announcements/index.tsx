import * as React                          from 'react';
import Linkify                             from 'react-linkify';
import { FontAwesomeIcon }                 from '@fortawesome/react-fontawesome';
import './style.css';
import { BasicAnnouncement } from '../../../common/types';

interface AnnouncementsProps {
  socket: SocketIOClient.Socket;
}

interface AnnouncementsState {
  announcements: BasicAnnouncement[];
  index: number;
  transitioning: boolean;
}

class Announcements extends React.Component<AnnouncementsProps, AnnouncementsState> {

  private announcementsTimer: number;

  constructor(props: AnnouncementsProps) {
    super(props);
    
    this.props.socket.emit('loadAnnouncements');
    
    this.props.socket.on('receiveAnnouncements', (announcements: BasicAnnouncement[]) => {
      this.setState({ announcements });
    });

    this.announcementsTimer = window.setInterval(this.cycleAnnouncements, 15000);

    this.state = {
      announcements: [{
        content: '',
        priority: false
      }],
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

      window.setTimeout(
        () => {
          this.setState({ index: newIndex, transitioning: false });
        },
        250
      );
    }
  }

  render() {
  if (this.state.announcements.length) {
    return (
      <div
        id="announcementsHolder"
        onClick={() => { this.cycleAnnouncements(); clearInterval(this.announcementsTimer); }}
      >
        <div id="announcementIcon">
          <FontAwesomeIcon icon="bullhorn" />
        </div>
        <div id="announcements">
          <span className={this.state.transitioning ? 'cyclingAnnouncements' : ''}>
            <Linkify properties={{ target: 'blank' }}>
              {this.state.announcements[this.state.index].content}
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
