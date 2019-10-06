import React, { useImperativeHandle, useRef } from 'react';
import {
	ConnectDropTarget,
	ConnectDragSource,
	DropTargetMonitor,
	DragSourceMonitor,
	ConnectDragPreview
} from 'react-dnd';
import { DragSource, DropTarget, DropTargetConnector, DragSourceConnector } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface AnnouncementProps {
	id: any;
	text: string;
	index: number;
	moveAnnouncement: (dragIndex: number, hoverIndex: number) => void;
	removeAnnouncement: (index: number) => void;

	isDragging: boolean;
	connectDragSource: ConnectDragSource;
	connectDropTarget: ConnectDropTarget;
	connectDragPreview: ConnectDragPreview;
}

interface AnnouncementInstance {
	getNode(): HTMLDivElement | null;
}

const Announcement = React.forwardRef<HTMLDivElement, AnnouncementProps>(
	({ text, index, removeAnnouncement, isDragging, connectDragSource, connectDropTarget, connectDragPreview }, ref) => {
		const elementRef = useRef(null);
		connectDropTarget(elementRef);

		const opacity = isDragging ? 0 : 1;
		useImperativeHandle<{}, AnnouncementInstance>(ref, () => ({
			getNode: () => elementRef.current
		}));
		return connectDragPreview(
			<div className="Announcement" ref={elementRef} style={{ opacity }}>
				{connectDragSource(
					<div className="AnnouncementHandle">
						<FontAwesomeIcon icon={{ iconName: 'grip-vertical', prefix: 'fas' }} />
					</div>
				)}

				<span className="AnnouncementText">{text}</span>
				<div className="AnnouncementDelete" onClick={() => removeAnnouncement(index)}>
					<FontAwesomeIcon icon={{ iconName: 'times', prefix: 'fas' }} />
				</div>
			</div>
		);
	}
);

export default DropTarget(
	'Announcement',
	{
		hover(props: AnnouncementProps, monitor: DropTargetMonitor, component: AnnouncementInstance) {
			if (!component) {
				return null;
			}
			// node = HTML Div element from imperative API
			const node = component.getNode();
			if (!node) {
				return null;
			}

			const dragIndex = monitor.getItem().index;
			const hoverIndex = props.index;

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = node.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Time to actually perform the action
			props.moveAnnouncement(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			monitor.getItem().index = hoverIndex;
		}
	},
	(connect: DropTargetConnector) => ({
		connectDropTarget: connect.dropTarget()
	})
)(
	DragSource(
		'Announcement',
		{
			beginDrag: (props: AnnouncementProps) => ({
				id: props.id,
				index: props.index
			})
		},
		(connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
			connectDragSource: connect.dragSource(),
			connectDragPreview: connect.dragPreview(),
			isDragging: monitor.isDragging()
		})
	)(Announcement)
);
