import * as React from 'react';
// import ClassBox from './ClassBox';
import { TfClass } from '../../../common/types';
import './style.css';

interface ClassListsProps {
  socket: SocketIOClient.Socket;
  classes: TfClass[];
}

class DraftArea extends React.Component<ClassListsProps, {}> {
  render() {
    return (
      <div id="ClassLists" />
    );
  }
}

export default DraftArea;