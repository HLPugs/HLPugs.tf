import React from 'react';
import './style.scss';
import { DraftTFClassList } from '../../common/types';
import ClassIcon from '../ClassIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SettingsViewModel } from '../../../../common/ViewModels/SettingsViewModel';

interface SettingsProps {
  socket: SocketIOClient.Socket;
  visibility: boolean;
  settingsOnClick: Function;
  classes: DraftTFClassList[];
  userAlias?: string;
  settings: SettingsViewModel;
}

class Settings extends React.PureComponent<SettingsProps, {}> {

  constructor(props: SettingsProps) {
    super(props);
  }

  savePress = () => {

    this.props.socket.on('playerSettings', (settings: SettingsViewModel) => {
      this.setState({ settings })
    });

    this.props.socket.emit('saveSettings', { alias: this.props.userAlias, settings: this.props.settings });

    this.props.settingsOnClick();
  }

  render() {
    if (!this.props.visibility) { return null; }

    return (
      <div id="settingsHolder">
        <div id="settings">
          <div className="settingsHeader">
            <FontAwesomeIcon icon="cog" />
            <span>Settings</span>
          </div>
          <div className="settingsSection">
            <div className="settingsTitle">
              Favorite Classes
            </div>
            <div className="settingsBody">
              <div className="favClassesHolder">
                {this.props.classes.map((tfclass: DraftTFClassList, index) => {
                  return (
                    <div className="favClass" key={index}>
                      <ClassIcon name={tfclass.name} />
                      <label htmlFor={`${tfclass}Check`}>{tfclass.name}</label>
                      <input id={`${tfclass.name}Check`} type="checkbox" />
                      <label htmlFor={`${tfclass.name}Check`} />
                    </div>
                  );
                })}
              </div>
              <input id="autoFavJoin" type="checkbox" />
              <label htmlFor="autoFavJoin">Auto-add to favorites when you join the site</label>
              <input id="autoFavPug" type="checkbox" />
              <label htmlFor="autoFavPug">Auto-add to favorites when a pug finishes</label>
            </div>
          </div>
          <div className="settingsSection">
            <div className="settingsTitle">
              Volume
            </div>
            <div className="settingsBody">
              <input type="range" />
              <input id="audioCues" type="checkbox" />
              <label htmlFor="audioCues">Play audio cues (during ready-up phase, etc.)</label>
            </div>
          </div>
          <div className="settingsSection">
            <div className="settingsTitle">
              Voice Packs
            </div>
            <div className="settingsBody">
              <select>
                <option>
                  Default
                </option>
              </select>
              <span className="hintText">
                Changes sounds that play on the site such as during ready-up phase, etc.
              </span>
            </div>
          </div>
          <div className="settingsSection">
            <div className="settingsTitle">
              Chat
            </div>
            <div className="settingsBody">
              <input id="chatPings" type="checkbox" />
              <label htmlFor="chatPings">
                Enable chat notifications when someone types @{this.props.userAlias}
              </label>
            </div>
          </div>
          <div className="settingsButtons">
            <button
              className="button button-secondary button-big"
              onClick={() => this.props.settingsOnClick()}
            >
              Cancel
            </button>
            <button
              className="button button-green button-big"
              onClick={this.savePress}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
