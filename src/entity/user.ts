import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Comment } from './comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  uname: string;

  @Column()
  phonenumber: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column({
    nullable:true 
  })
  utype: string;

  @Column({
    nullable:true 
  })
  gender: string;

  @Column({
    nullable:true 
  })
  status: string;

  @Column()
  createtime: Date;

  @Column({
    nullable:true 
  })
  headurl: string;

  // @OneToMany(type => Comment, comment => comment.user)
  // comments: Comment[];
}
