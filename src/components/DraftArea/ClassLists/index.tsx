import * as React from 'react';
import ClassBox from './ClassBox';
import { TfClass } from '../../../common/types';
import './style.css';

interface ClassListsProps {
  socket: SocketIOClient.Socket;
  classes: TfClass[];
  steamid?: string;
}

class DraftArea extends React.Component<ClassListsProps, {}> {
  render() {
    return (
      <div id="classList">
        {this.props.classes.map((tfclass: TfClass) => 
          <ClassBox properties={tfclass} key={tfclass.name} socket={this.props.socket} steamid={this.props.steamid} />
        )}
      </div>
    );
  }
}

export default DraftArea;