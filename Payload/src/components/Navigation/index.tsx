import React from 'react';
import { NavItem } from '../../../../Common/Models/SiteConfigurationModel';
import NavigationItem from './NavigationItem';
import './style.scss';

interface NavigationProps {
	navigationGroup: NavItem[];
}

class Navigation extends React.PureComponent<NavigationProps, {}> {
	render() {
		return (
			<nav>
				{this.props.navigationGroup.map((navItem: NavItem, index: number) => (
					<NavigationItem properties={navItem} key={index} />
				))}
			</nav>
		);
	}
}

export default Navigation;
