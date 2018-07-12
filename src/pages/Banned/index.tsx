import * as React from 'react';
import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import { SiteConfiguration } from '../../common/types';
import * as moment from 'moment';
import { Moment } from 'moment';
import './style.css';

interface BannedProps {
    socket: SocketIOClient.Socket;
    configuration: SiteConfiguration;
}

interface BannedState {
    banReason: string;
    banDate: Moment;
    unBanDate: Moment;
}

class Banned extends React.Component<BannedProps, BannedState> {
    constructor(props: BannedProps) {
        super(props);

        this.state = {
            banReason: 'Mic Spamming',
            banDate: moment(),
            unBanDate: moment().add(14, 'days')
        };
    }

    render() {
        return (
            <div id="Banned">
                <Header
                    siteName={this.props.configuration.branding.siteName}
                    siteSubTitle={this.props.configuration.branding.siteSubTitle}
                    logoPath={this.props.configuration.branding.logoPath}
                />
                <Navigation navigationGroup={this.props.configuration.navigation} />
                <div id="BannedInfo">
                    <span>Ban Reason: {this.state.banReason}</span>
                    <span>Ban Start: {this.state.banDate.format('LLL')}</span>
                    <span>Ban End: {this.state.unBanDate.format('LLL')}</span>
                </div>
            </div>
        );
    }
}

export default Banned;