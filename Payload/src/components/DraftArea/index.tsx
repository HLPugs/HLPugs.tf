import React from 'react';
import ClassLists from './ClassLists';
import DraftState from './DraftState';
import Announcements from './Announcements';
import './style.scss';
import { SocketConsumer } from '../../pages/Home';
import GamemodeClassScheme from '../../../../Common/Models/GamemodeClassScheme';

interface DraftAreaProps {
	classes: GamemodeClassScheme[];
	steamid?: string;
}

class DraftArea extends React.PureComponent<DraftAreaProps, {}> {
	render() {
		return (
			<SocketConsumer>
				{(socket: SocketIOClient.Socket) => (
					<main>
						<Announcements socket={socket} />
						<DraftState socket={socket} />
						<ClassLists
							classes={this.props.classes}
							steamid={this.props.steamid}
						/>
					</main>
				)}
			</SocketConsumer>
		);
	}
}

export default DraftArea;
