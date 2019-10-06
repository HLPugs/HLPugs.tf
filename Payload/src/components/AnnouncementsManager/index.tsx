import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import React, { useState, useRef } from 'react';
import update from 'immutability-helper';
import Announcement from './Announcment';
import AdminAnnouncementViewModel from '../../../../Common/ViewModels/AdminAnnouncementViewModel';
import Region from '../../../../Common/Enums/Region';

interface AdminAnnouncementProps {
	socket: SocketIOClient.Socket;
}

export default function AnnouncementsManager(props: AdminAnnouncementProps) {
	props.socket.emit('getAdminAnnouncements');

	props.socket.on('getAdminAnnouncements', (viewmodels: AdminAnnouncementViewModel[]) => {
		setAnnouncements(viewmodels);
		setOriginalAnnouncements(viewmodels);
	});

	const [announcements, setAnnouncements] = useState<AdminAnnouncementViewModel[]>([]);

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
			const newAnnouncement = new AdminAnnouncementViewModel();
			newAnnouncement.messageContent = announcementText;
			newAnnouncement.region = Region.All;

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

	const announcementsModified = (): boolean => {
		console.log(announcements, originalAnnouncements);
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
							key={announcement.id + announcement.messageContent}
							index={i}
							id={announcement.id}
							text={announcement.messageContent}
							moveAnnouncement={moveAnnouncement}
							removeAnnouncement={removeAnnouncement}
						/>
					))}
				</div>
				<div className={announcementsModified() ? 'Save' : 'Save Unsaved'} onClick={saveAnnouncements}>
					Save
				</div>
			</div>
		</main>
	);
}
