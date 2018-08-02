import * as React                         from 'react';
import ClassLists                         from './ClassLists';
import DraftState                         from './DraftState';
import Announcements                      from './Announcements';
import { DraftTFClassList }               from '../../common/types';
import './style.css';

interface DraftAreaProps {
  socket: SocketIOClient.Socket;
  classes: DraftTFClassList[];
  steamid?: string;
}

class DraftArea extends React.Component<DraftAreaProps, {}> {
  render() {
    return (
      <main>
        <Announcements socket={this.props.socket} />
        <DraftState socket={this.props.socket} />
        <ClassLists classes={this.props.classes} socket={this.props.socket} steamid={this.props.steamid} />
      </main>
    );
  }
}

export default DraftArea;
