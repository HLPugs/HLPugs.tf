import React from 'react';
import { SiteBranding } from '../../../../Common/Models/SiteConfigurationModel'
import HeaderBranding from './HeaderBranding';
import HeaderBackground from './HeaderBackground';
import './style.scss';

class Header extends React.PureComponent<SiteBranding, {}> {
	render() {
		return (
			<header>
				<HeaderBranding
					siteName={this.props.siteName}
					siteSubTitle={this.props.siteSubTitle}
					logoPath={this.props.logoPath}
				/>
				<HeaderBackground />
			</header>
		);
	}
}

export default Header;
