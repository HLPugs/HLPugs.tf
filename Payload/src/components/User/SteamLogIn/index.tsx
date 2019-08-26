import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';

class SteamLogIn extends React.Component {
	render() {
		return (
			<a
				id="SteamLogIn"
				href={`${window.location.protocol}//${window.location.hostname}:3001/auth`}
			>
				<FontAwesomeIcon icon={['fab', 'steam-symbol']} />
				<span>Sign in with Steam</span>
			</a>
		);
	}
}

export default SteamLogIn;
