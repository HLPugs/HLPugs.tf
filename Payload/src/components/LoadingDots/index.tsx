import React from 'react';
import './style.scss';

class LoadingDots extends React.PureComponent {
	render() {
		return (
			<div id="loadingDots">
				<div className="loadingDotHolder">
					<div className="loadingDot" />
				</div>
				<div
					className="loadingDotHolder"
					style={{ '--delay': '.1s' } as React.CSSProperties}
				>
					<div className="loadingDot" />
				</div>
				<div
					className="loadingDotHolder"
					style={{ '--delay': '.2s' } as React.CSSProperties}
				>
					<div className="loadingDot" />
				</div>
			</div>
		);
	}
}

export default LoadingDots;
