import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  likeid: number;

  @Column()
  uid: number;

  @Column()
  pid: number;

  @Column()
  liketime: Date;
  

}
