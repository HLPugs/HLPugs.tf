import React from 'react';
import ClassBox from './ClassBox';
import './style.scss';
import { SocketConsumer } from '../../../pages/Home';
import GamemodeClassScheme from '../../../../../Common/Models/GamemodeClassScheme';

interface ClassListsProps {
	classes: GamemodeClassScheme[];
	steamid?: string;
}

class DraftArea extends React.Component<ClassListsProps, {}> {
	render() {
		return (
			<SocketConsumer>
				{(socket: SocketIOClient.Socket) => (
					<div id="classList">
						{this.props.classes.map(tfclass => (
							<ClassBox
								properties={tfclass}
								key={tfclass.tf2class}
								socket={socket}
								steamid={this.props.steamid}
							/>
						))}
					</div>
				)}
			</SocketConsumer>
		);
	}
}

export default DraftArea;
