import React, { ChangeEvent } from 'react';
import './style.scss';
import ClassIcon from '../ClassIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PlayerSettingsViewModel } from '../../../../Common/ViewModels/PlayerSettingsViewModel';
import GamemodeClassScheme from '../../../../Common/Models/GamemodeClassScheme';
import DraftTFClass from '../../../../Common/Enums/DraftTFClass';
import SteamID from '../../../../Common/Types/SteamID';
import GetPlayerSettingsRequest from '../../../../Common/Requests/GetPlayerSettingsRequest';
import UpdatePlayerSettingsRequest from '../../../../Common/Requests/UpdatePlayerSettingsRequest';
import PropertyOf from '../../../../Common/Utils/PropertyOf';

interface SettingsProps {
	socket: SocketIOClient.Socket;
	visibility: boolean;
	settingsOnClick: Function;
	classes: GamemodeClassScheme[];
	userAlias: string;
	steamid: SteamID;
}

interface SettingsState {
	settings: PlayerSettingsViewModel;
}

class Settings extends React.PureComponent<SettingsProps, SettingsState> {
	constructor(props: SettingsProps) {
		super(props);
		this.state = {
			settings: new PlayerSettingsViewModel()
		};

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.props.socket.emit('getPlayerSettings', { steamid: this.props.steamid } as GetPlayerSettingsRequest);

		this.props.socket.on('getPlayerSettings', (settings: PlayerSettingsViewModel) => {
			this.setState({ settings });
		});
	}

	savePress = () => {
		this.props.socket.emit('saveSettings', {
			steamid: this.props.steamid,
			playerSettingsViewModel: this.state.settings
		} as UpdatePlayerSettingsRequest);
		this.props.settingsOnClick();
	};

	cancelPress = () => {
		this.props.socket.emit('getPlayerSettings', { steamid: this.props.steamid } as GetPlayerSettingsRequest);
		this.props.settingsOnClick();
	};

	handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === 'favoriteClasses') {
			this.toggleFavoriteClass(e.target.dataset.tfclass as DraftTFClass);
		} else {
			const newSettings = this.state.settings;
			const setting = e.target.name as keyof PlayerSettingsViewModel;
			const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value) as never;
			newSettings[setting] = value;
			this.setState({ settings: newSettings });
		}
	};

	handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		// Save voicepack or other select's if we add them
	};

	toggleFavoriteClass = (toggledTFClass: DraftTFClass) => {
		const newSettings = this.state.settings;
		newSettings.favoriteClasses[toggledTFClass] = !this.state.settings.favoriteClasses[toggledTFClass];
		this.setState({
			settings: newSettings
		});
	};

	render() {
		if (!this.props.visibility) {
			return null;
		}

		return (
			<div id="settingsHolder">
				<form>
					<div id="settings">
						<div className="settingsHeader">
							<FontAwesomeIcon icon="cog" />
							<span>Settings</span>
						</div>
						<div className="settingsSection">
							<div className="settingsTitle">Favorite Classes</div>
							<div className="settingsBody">
								<div className="favClassesHolder">
									{this.props.classes.map((scheme: GamemodeClassScheme, index) => {
										return (
											<div className="favClass" key={index}>
												<ClassIcon name={scheme.tf2class} />
												<label htmlFor={`${scheme}Check`}>{scheme.tf2class}</label>
												<input
													onChange={this.handleChange}
													name={PropertyOf<PlayerSettingsViewModel>('favoriteClasses')}
													checked={this.state.settings.favoriteClasses[scheme.tf2class]}
													data-tfclass={scheme.tf2class}
													id={`${scheme.tf2class}Check`}
													type="checkbox"
												/>
												<label htmlFor={`${scheme.tf2class}Check`} />
											</div>
										);
									})}
								</div>
								<input
									onChange={this.handleChange}
									name={PropertyOf<PlayerSettingsViewModel>('addToFavoritesOnLogin')}
									checked={this.state.settings.addToFavoritesOnLogin}
									id="autoFavJoin"
									type="checkbox"
								/>
								<label htmlFor="autoFavJoin">Auto-add to favorites when you join the site</label>
								<input
									onChange={this.handleChange}
									name={PropertyOf<PlayerSettingsViewModel>('addToFavoritesAfterMatch')}
									checked={this.state.settings.addToFavoritesAfterMatch}
									id="autoFavMatch"
									type="checkbox"
								/>
								<label htmlFor="autoFavMatch">Auto-add to favorites when a pug finishes</label>
							</div>
						</div>
						<div className="settingsSection">
							<div className="settingsTitle">Volume</div>
							<div className="settingsBody">
								<input
									onChange={this.handleChange}
									name={PropertyOf<PlayerSettingsViewModel>('volume')}
									value={this.state.settings.volume}
									type="range"
								/>
								<input
									onChange={this.handleChange}
									name={PropertyOf<PlayerSettingsViewModel>('audioCuesEnabled')}
									checked={this.state.settings.audioCuesEnabled}
									id="audioCues"
									type="checkbox"
								/>
								<label htmlFor="audioCues">Play audio cues (during ready-up phase, etc.)</label>
							</div>
						</div>
						<div className="settingsSection">
							<div className="settingsTitle">Voice Packs</div>
							<div className="settingsBody">
								<select
									onChange={this.handleChangeSelect}
									name={PropertyOf<PlayerSettingsViewModel>('voicepack')}
									value={this.state.settings.voicepack}
								>
									<option value="default">Default</option>
								</select>
								<span className="hintText">
									Changes sounds that play on the site such as during ready-up phase, etc.
								</span>
							</div>
						</div>
						<div className="settingsSection">
							<div className="settingsTitle">Chat</div>
							<div className="settingsBody">
								<input
									onChange={this.handleChange}
									name={PropertyOf<PlayerSettingsViewModel>('isNotifiableByMention')}
									checked={this.state.settings.isNotifiableByMention}
									id="notifiableByMention"
									type="checkbox"
								/>
								<label htmlFor="notifiableByMention">
									Enable chat notifications when someone types @{this.props.userAlias}
								</label>
							</div>
						</div>
						<div className="settingsButtons">
							<button className="button button-secondary button-big" onClick={this.cancelPress}>
								Cancel
							</button>
							<button className="button button-green button-big" onClick={this.savePress}>
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default Settings;
