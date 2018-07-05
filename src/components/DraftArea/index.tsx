import * as React from 'react';
import ClassLists from './ClassLists';
import { TfClass } from '../../common/types';
import './style.css';

interface DraftAreaProps {
  socket: SocketIOClient.Socket;
  classes: TfClass[];
}

class DraftArea extends React.Component<DraftAreaProps, {}> {
  render() {
    return (
      <main>
        <ClassLists classes={this.props.classes} socket={this.props.socket} />
      </main>
    );
  }
}

export default DraftArea;