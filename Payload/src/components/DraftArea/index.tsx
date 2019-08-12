import React from 'react';
import ClassLists from './ClassLists';
import DraftState from './DraftState';
import Announcements from './Announcements';
import { DraftTFClassList } from '../../common/types';
import './style.scss';
import { SocketConsumer } from '../../pages/Home';

interface DraftAreaProps {
  classes: DraftTFClassList[];
  steamid?: string;
}

class DraftArea extends React.PureComponent<DraftAreaProps, {}> {
  render() {
    return (
      <SocketConsumer>
        {(socket: SocketIOClient.Socket) => (
          <main>
            <Announcements socket={socket} />
            <DraftState socket={socket} />
            <ClassLists classes={this.props.classes} steamid={this.props.steamid} />
          </main>
        )}
      </SocketConsumer>
    );
  }
}

export default DraftArea;
