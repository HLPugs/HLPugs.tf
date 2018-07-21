import * as React from 'react';
import { SiteConfiguration, UserScheme } from '../../common/types';
import Header from '../../components/Header';
import User from '../../components/User';
import Navigation from '../../components/Navigation';
import DraftArea from '../../components/DraftArea';
import Chat from '../../components/Chat';
import AliasModal from '../../components/AliasModal';
import './style.css';

interface HomeProps {
    socket: SocketIOClient.Socket;
    configuration: SiteConfiguration;
    user: UserScheme;
}

class Home extends React.Component<HomeProps, {}> {
    AliasModal = () => {
        if (!this.props.user.alias && this.props.user.loggedIn) {
            return <AliasModal socket={this.props.socket} />;
        }
        
        return null;
    }

    render() {
        return (
            <div id="Home">
                <Header 
                    siteName={this.props.configuration.branding.siteName} 
                    siteSubTitle={this.props.configuration.branding.siteSubTitle}
                    logoPath={this.props.configuration.branding.logoPath} 
                />
                <User user={this.props.user} />
                <Navigation navigationGroup={this.props.configuration.navigation} />
                <DraftArea socket={this.props.socket} classes={this.props.configuration.classes} />
                <Chat socket={this.props.socket} loggedIn={this.props.user.loggedIn} />
                {this.AliasModal()}
            </div>
        );
    }
}

export default Home;