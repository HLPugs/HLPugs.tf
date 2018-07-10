import * as React from 'react';
import ClassBox from './ClassBox';
import { TfClass } from '../../../common/types';
import './style.css';

interface ClassListsProps {
  socket: SocketIOClient.Socket;
  classes: TfClass[];
}

class DraftArea extends React.Component<ClassListsProps, {}> {
  render() {
    return (
      <div id="classList">
        {this.props.classes.map((tfclass: TfClass) => 
          <ClassBox properties={tfclass} key={tfclass.name} socket={this.props.socket} />
        )}
      </div>
    );
  }
}

export default DraftArea;