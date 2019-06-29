import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Region } from 'Region';

@Entity('announcements')
export class Announcement extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 512 })
  message: string;

  @Column({ nullable: false, length: 20 })
  creator: string;

  @Column('enum', { default: 'all' })
  public readonly region: Region = 'all';

  static async createAnnouncement(announcement: Announcement) {
    await this.save(announcement);
  }

}
