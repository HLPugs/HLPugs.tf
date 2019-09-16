import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PermissionGroup from '../../../../../Common/Enums/PermissionGroup';

interface UserDropDownProps {
	permissionGroup?: PermissionGroup;
	steamid?: string;
	settingsOnClick: Function;
}

class UserDropDown extends React.Component<UserDropDownProps, {}> {
	render() {
		return (
			<ul id="UserDropDown">
				{this.props.permissionGroup !== PermissionGroup.NONE ? (
					<li>
						<Link to="/Admin">
							Admin
						</Link>
					</li>
				) : null}
				<li>
					<Link to={`/player/${this.props.steamid}`}>
						<FontAwesomeIcon icon="user" />
						Profile
					</Link>
				</li>
				<li onClick={() => this.props.settingsOnClick()}>
					<FontAwesomeIcon icon="cog" />
					Settings
				</li>
			</ul>
		);
	}
}

export default UserDropDown;
