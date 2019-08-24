import React from 'react';
import { DraftTFClassList } from '../../../../common/types';
import ClassIcon from '../../../ClassIcon';
import './style.scss';
import PlayerBox from './PlayerBox';
import DraftTFClass from '../../../../../../Common/Enums/DraftTFClass';

interface ClassBoxProps {
  properties: DraftTFClassList;
  socket: SocketIOClient.Socket;
  steamid?: string;
}

interface ClassBoxState {
  players: string[];
}

class ClassBox extends React.Component<ClassBoxProps, ClassBoxState> {
  constructor(props: ClassBoxProps) {
    super(props);

    this.props.socket.emit('getDraftTFClassList', this.props.properties.name);

    this.props.socket.on('reconnect', () => {
      this.props.socket.emit('getDraftTFClassList', this.props.properties.name);
    });

    this.props.socket.on('draftTFClassList', (tfClass: DraftTFClass, tfClassList: string[]) => {
      if (tfClass === this.props.properties.name) {
        this.setState({
          players: tfClassList
        });
      }
    });

    this.props.socket.on('addToDraftTFClass', (tfClass: DraftTFClass, steamid: string) => {
      if (tfClass === this.props.properties.name) {
        this.setState({
          players: [...this.state.players, steamid]
        });
      }
    });

    this.props.socket.on('removeFromDraftTFClass', (tfClass: DraftTFClass, steamid: string) => {
      if (tfClass === this.props.properties.name) {
        const newPlayers = [...this.state.players];
        const indexOfPlayer = newPlayers.indexOf(steamid);

        if (indexOfPlayer >= 0) {
          newPlayers.splice(indexOfPlayer, 1);

          this.setState({
            players: newPlayers
          });
        }
      }
    });

    this.state = {
      players: []
    };
  }

  toggleClass = () => {
    if (!this.props.steamid) { return; }

    if (this.state.players.indexOf(this.props.steamid) >= 0) {
      this.props.socket.emit('removeFromDraftTFClass', this.props.properties.name);
    } else {
      this.props.socket.emit('addToDraftTFClass', this.props.properties.name);
    }
  }

  checkbox = () => {
    if (!this.props.steamid) { return <div />; }

    return (
      <div
        className={this.state.players.indexOf(this.props.steamid) >= 0 ?
          'classCheckbox checked' : 'classCheckbox'}
        onClick={this.toggleClass}
      />
    );
  }

  render() {
    return (
      <div className="tfclass">
        <div className="classHeader">
          <span className="classIcon"><ClassIcon name={this.props.properties.name} /></span>
          <span/>
          <span className="className">{this.props.properties.name}</span>
          <span className="count">
            <span className="added">{this.state.players.length}</span>
            <span>/</span>
            <span className="needed">{this.props.properties.numberPerTeam * 2}</span>
          </span>
          {this.checkbox()}
        </div>
        <div className="playerList">
          {this.state.players.map((player) =>
            <PlayerBox steamid={player} key={player} />
          )}
        </div>
      </div>
    );
  }
}

export default ClassBox;
