import React from 'react';
import ClassBox from './ClassBox';
import { DraftTFClassList } from '../../../common/types';
import './style.scss';
import { SocketConsumer } from '../../../pages/Home';

interface ClassListsProps {
	classes: DraftTFClassList[];
	steamid?: string;
}

class DraftArea extends React.Component<ClassListsProps, {}> {
	render() {
		return (
			<SocketConsumer>
				{(socket: SocketIOClient.Socket) => (
					<div id="classList">
						{this.props.classes.map((tfclass: DraftTFClassList) => (
							<ClassBox
								properties={tfclass}
								key={tfclass.name}
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
