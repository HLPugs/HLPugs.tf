import * as React from 'react';
import { TfClass } from '../../../../common/types';
import ClassIcon from '../../../ClassIcon';
import './style.css';

interface ClassBoxProps {
    properties: TfClass;
    socket: SocketIOClient.Socket;
}

class ClassBox extends React.Component<ClassBoxProps, {}> {
    constructor(props: ClassBoxProps) {
        super(props);
    }

    render() {
        return(
            <div className="tfclass">
                <div className="classHeader">
                    <span className="classIcon"><ClassIcon name={this.props.properties.name} /></span>
                    <span/>
                    <span className="className">{this.props.properties.name}</span>
                    <span className="count">
                        <span className="added">0</span>
                        /
                        <span className="needed">{this.props.properties.numberPerTeam * 2}</span>
                    </span>
                    <div className="classCheckbox"/>
                </div>
                <div className="playerList" />
            </div>
        );
    }
}

export default ClassBox;