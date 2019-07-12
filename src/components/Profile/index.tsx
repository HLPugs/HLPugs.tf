import React from 'react';

import './style.scss';
import { RouteComponentProps } from 'react-router-dom';

interface ProfileProps {
  steamid: string;
}

class Profile extends React.Component<ProfileProps, {}> {
  render() {
    return (
      <main>
        <div className="profileWindow">
          <div className="profile">
            <div className="identity">
              <a
                href={`https://steamcommunity.com/profiles/${this.props.steamid}`}
                className="profilePicture"
                target="_blank"
              />
              <div className="profileInfo">
                <div className="alias">Nicell</div>
                <div className="quickLinks">
                  <a
                    className="quickLink"
                    href={`https://steamcommunity.com/profiles/${this.props.steamid}`}
                    target="_blank"
                  >
                    <span>Steam</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`https://logs.tf/profile/${this.props.steamid}`}
                    target="_blank"
                  >
                    <span>Logs.tf</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`https://demos.tf/profiles/${this.props.steamid}`}
                    target="_blank"
                  >
                    <span>Demos.tf</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`http://hl.rgl.gg/Public/PlayerProfile.aspx?p=${this.props.steamid}`}
                    target="_blank"
                  >
                    <span>RGL.gg</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`https://etf2l.org/search/${this.props.steamid}`}
                    target="_blank"
                  >
                    <span>ETF2L</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`http://www.ugcleague.com/players_page.cfm?player_id=${this.props.steamid}`}
                    target="_blank"
                  >
                    <span>UGC</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Profile;