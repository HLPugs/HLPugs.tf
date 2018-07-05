import * as React from 'react';
import { SiteBranding } from '../../common/types';
import HeaderBranding from './HeaderBranding';
import HeaderBackground from './HeaderBackground';
import './style.css';

class Header extends React.Component<SiteBranding, {}> {
  render() {
    return(
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