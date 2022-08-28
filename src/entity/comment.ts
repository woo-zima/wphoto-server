import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';
import { Photo } from './photo';
import { User } from './user';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  plid: number;

  @Column()
  uid: number;

  @Column()
  pid: number;

  @Column()
  content: string;

  @Column()
  pltime: Date;

  @Column()
  iscross: number;

  // @ManyToOne(type => User, user => user.comments)
  // user: User;

  // @ManyToOne(type => Photo, photo => photo.comments)
  // photo: Photo;
}
