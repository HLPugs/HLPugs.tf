import React from 'react';

import './style.scss';
import HttpClient from '../../common/HttpClient';
import { ProfileViewModel } from '../../../../common/ViewModels/ProfileViewModel';
import LoadingDots from '../LoadingDots';

import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipPayload} from 'recharts';
import ClassIcon from '../ClassIcon';
import DraftTFClass from '../../../../common/Models/DraftTFClass';

const data = [
  {
    TFClass: 'Scout',
    wins: 246,
    ties: 20,
    losses: 274
  }, {
    TFClass: 'Soldier',
    wins: 85,
    ties: 8,
    losses: 93
  }, {
    TFClass: 'Pyro',
    wins: 26,
    ties: 2,
    losses: 24
  }, {
    TFClass: 'Demo',
    wins: 174,
    ties: 14,
    losses: 186
  }, {
    TFClass: 'Heavy',
    wins: 31,
    ties: 4,
    losses: 32
  }, {
    TFClass: 'Engineer',
    wins: 26,
    ties: 2,
    losses: 29
  }, {
    TFClass: 'Medic',
    wins: 8,
    ties: 1,
    losses: 19
  }, {
    TFClass: 'Sniper',
    wins: 33,
    ties: 3,
    losses: 50
  }, {
    TFClass: 'Spy',
    wins: 28,
    ties: 2,
    losses: 29
  }
]

interface ProfileProps {
  steamid: string;
}

interface ProfileState {
  loading: boolean;
  player?: ProfileViewModel;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
  http: HttpClient;

  constructor(props: ProfileProps) {
    super(props);

    this.state = {
      loading: true
    };

    this.http = new HttpClient();
  }

  componentDidMount() {
    this.getPlayerData();
  }

  getPlayerData = async () => {
    this.setState({
      loading: true
    });

    const player = await this.http.get(`/profile/${this.props.steamid}`);

    this.setState({
      loading: false,
      player
    });
  }

  render() {
    return this.state.player ? (
      <main>
        <div className="profileWindow">
          <div className="profile">
            <div className="identity">
              <a
                href={`https://steamcommunity.com/profiles/${this.props.steamid}`}
                style={{backgroundImage: `url('${this.state.player.avatarUrl}')`}}
                className="profilePicture"
                target="_blank"
                rel="noopener noreferrer"
              />
              <div className="profileInfo">
                <div className="alias">{this.state.player.alias}</div>
                <div className="quickLinks">
                  <a
                    className="quickLink"
                    href={`https://steamcommunity.com/profiles/${this.props.steamid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Steam</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`https://logs.tf/profile/${this.props.steamid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Logs.tf</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`https://demos.tf/profiles/${this.props.steamid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Demos.tf</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`http://hl.rgl.gg/Public/PlayerProfile.aspx?p=${this.props.steamid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>RGL.gg</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`https://etf2l.org/search/${this.props.steamid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>ETF2L</span>
                  </a>
                  <a
                    className="quickLink"
                    href={`http://www.ugcleague.com/players_page.cfm?player_id=${this.props.steamid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>UGC</span>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <BarChart
                width={600}
                height={400}
                reverseStackOrder={true}
                data={data}
              >
                <XAxis dataKey="TFClass" tickSize={0} tickFormatter={() => null} tick={renderClassAxisTick} />
                <YAxis />
                {/* 
                // @ts-ignore */}
                <Tooltip
                  cursor={{fill: 'var(--background)'}}
                  contentStyle={{background: 'var(--background-light)', borderRadius: 4, border: 'none', boxShadow: 'var(--paper-1)'}}
                  formatter={(value, prop: string) => [value, prop.charAt(0).toUpperCase() + prop.slice(1)]}
                  itemSorter={(payload: TooltipPayload) => -payload.name.charCodeAt(0)}
                />
                <Bar dataKey="wins" stackId="a" fill="#4caf50" />
                <Bar dataKey="ties" stackId="a" fill="#ffeb3b" />
                <Bar dataKey="losses" stackId="a" fill="#f44336" />
              </BarChart>
            </div>
          </div>
        </div>
      </main>
    ) : (
      <main>
        <div className="loadingHolder">
          <LoadingDots/>
        </div>
      </main>
    );
  }
}

const renderClassAxisTick = ({ x, y, payload }: { x: number, y: number, payload: {value: DraftTFClass} }) => {
  return (
    <svg x={x - 16} y={y + 4} width={32} height={32}>
      <ClassIcon name={payload.value} />
    </svg>
  );
};

export default Profile;