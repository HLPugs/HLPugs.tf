import React from 'react';
import { SiteBranding } from '../../../../../Common/Models/SiteConfigurationModel';
import { Link } from 'react-router-dom';
import logo from '../../../img/logo.svg';
import './style.scss';

class HeaderBranding extends React.Component<SiteBranding, {}> {
	render() {
		if (!this.props.siteName || !this.props.siteSubTitle) {
			return null;
		}

		return (
			<div id="HeaderBranding">
				<Link to="/">
					<div id="logo" style={{ backgroundImage: `url(${logo})` }} />
					<div id="siteText">
						<span id="siteName">{this.props.siteName}</span>
						<span id="siteSubTitle">{this.props.siteSubTitle}</span>
					</div>
				</Link>
			</div>
		);
	}
}

export default HeaderBranding;
