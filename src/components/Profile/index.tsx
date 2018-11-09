import * as React from 'react';

import './style.css';

class Profile extends React.Component<{}, {}> {
  render() {
    return (
      <main>
        <div className="profileWindow">
          <div className="profile">
            <div className="identity">
              <div className="profilePicture"/>
              <div className="profileInfo">
                <div className="alias">Nicell</div>
                <div className="quickLinks">
                  <div className="quickLink"/>
                  <div className="quickLink" />
                  <div className="quickLink" />
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