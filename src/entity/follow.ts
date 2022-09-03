import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  gzid: number;

  @Column()
  uid: number;

  @Column()
  followuid: number;

  @Column()
  followtime: Date;
}