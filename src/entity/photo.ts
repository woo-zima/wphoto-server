import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Comment } from './comment';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  pid: number;
  
  @Column()
  upid: number;

  @Column()
  pname: string;

  @Column()
  psize: string;

  @Column()
  pwidth: number;

  @Column()
  pheight: number;

  @Column()
  pdescribe: string;

  @Column()
  uptime: Date;

  @Column()
  purl: string;

  @Column({
    nullable:true 
  })
  clicktime: Date;

  // @OneToMany(type => Comment, comment => comment.photo)
  // comments: Comment[];
}
