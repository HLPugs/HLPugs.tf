import React from 'react';
import ClassBox from './ClassBox';
import { DraftTFClassList } from '../../../common/types';
import './style.scss';

interface ClassListsProps {
  socket: SocketIOClient.Socket;
  classes: DraftTFClassList[];
  steamid?: string;
}

class DraftArea extends React.Component<ClassListsProps, {}> {
  render() {
    return (
      <div id="classList">
        {this.props.classes.map((tfclass: DraftTFClassList) =>
          <ClassBox properties={tfclass} key={tfclass.name} socket={this.props.socket} steamid={this.props.steamid} />
        )}
      </div>
    );
  }
}

export default DraftArea;
