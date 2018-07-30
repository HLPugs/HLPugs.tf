import * as React from 'react';
import { SiteConfiguration, UserScheme } from '../../common/types';
import Header from '../../components/Header';
import User from '../../components/User';
import Navigation from '../../components/Navigation';
import DraftArea from '../../components/DraftArea';
import Chat from '../../components/Chat';
import AliasModal from '../../components/AliasModal';
import Settings from '../../components/Settings';
import './style.css';

interface HomeProps {
    socket: SocketIOClient.Socket;
    configuration: SiteConfiguration;
    user: UserScheme;
}

interface HomeState {
    settingsOpen: boolean;
}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);

        this.state = {
            settingsOpen: false
        };
    }

    AliasModal = () => {
        if (!this.props.user.alias && this.props.user.loggedIn) {
            return <AliasModal socket={this.props.socket} />;
        }

        // Tell server that this socket connection is on the homepage
        this.props.socket.emit('home');
        
        return null;
    }

    toggleSettings = () => {
        this.setState({
            settingsOpen: !this.state.settingsOpen
        });
    }

    render() {
        return (
            <div id="Home">
                <Header 
                    siteName={this.props.configuration.branding.siteName} 
                    siteSubTitle={this.props.configuration.branding.siteSubTitle}
                    logoPath={this.props.configuration.branding.logoPath} 
                />
                <User user={this.props.user} settingsOnClick={this.toggleSettings} />
                <Navigation navigationGroup={this.props.configuration.navigation} />
                <DraftArea socket={this.props.socket} classes={this.props.configuration.classes} />
                <Chat socket={this.props.socket} user={this.props.user} />
                <Settings
                    visibility={this.state.settingsOpen}
                    socket={this.props.socket}
                    classes={this.props.configuration.classes}
                    settingsOnClick={this.toggleSettings}
                    userAlias={this.props.user.alias}
                />
                {this.AliasModal()}
            </div>
        );
    }
}

export default Home;