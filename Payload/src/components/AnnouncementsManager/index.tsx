import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import React, { useState, useRef } from 'react';
import update from 'immutability-helper';
import Announcement from './Announcment';

interface Announcement {
	id?: number;
	text: string;
}

export default function AnnouncementsManager() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([
		{
			id: 1,
			text: 'Test announcement here'
		},
		{
			id: 2,
			text: 'Testing all of the announcements'
		}
	]);

	const [originalAnnouncements, setOriginalAnnouncements] = useState([...announcements]);

	const announcementInput = useRef<HTMLInputElement>(null);

	const moveAnnouncement = (dragIndex: number, hoverIndex: number) => {
		const dragCard = announcements[dragIndex];
		setAnnouncements(
			update(announcements, {
				$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
			})
		);
	};

	const addAnnouncement = () => {
		const announcementText = announcementInput.current!.value;

		if (announcementText.length > 0) {
			const newAnnouncement = {
				text: announcementText
			};

			setAnnouncements(
				update(announcements, {
					$push: [newAnnouncement]
				})
			);

			announcementInput.current!.value = '';
		}
	};

	const removeAnnouncement = (index: number) => {
		setAnnouncements(
			update(announcements, {
				$splice: [[index, 1]]
			})
		);
	};

	const diffCheck = (): boolean => {
		if (announcements.length !== originalAnnouncements.length) {
			return false;
		}

		for (let i = 0; i < announcements.length; i++) {
			if (!originalAnnouncements[i] || announcements[i].id !== originalAnnouncements[i].id) {
				return false;
			}
		}

		return true;
	};

	const saveAnnouncements = () => {
		setOriginalAnnouncements([...announcements]);
	};

	return (
		<main>
			<div className="ManagementWindow">
				<h1>Announcments</h1>
				<div className="AddBar">
					<input placeholder="New announcement text" ref={announcementInput} />
					<div onClick={addAnnouncement}>
						<FontAwesomeIcon icon={{ iconName: 'plus', prefix: 'fas' }} />
					</div>
				</div>
				<div className="ListBox">
					{announcements.map((announcement, i) => (
						<Announcement
							key={announcement.id + announcement.text}
							index={i}
							id={announcement.id}
							text={announcement.text}
							moveAnnouncement={moveAnnouncement}
							removeAnnouncement={removeAnnouncement}
						/>
					))}
				</div>
				<div className={diffCheck() ? 'Save' : 'Save Unsaved'} onClick={saveAnnouncements}>
					Save
				</div>
			</div>
		</main>
	);
}
