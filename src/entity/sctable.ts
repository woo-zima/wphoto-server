import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sctable {
  @PrimaryGeneratedColumn()
  scid: number;

  @Column()
  uid: number;

  @Column()
  pid: number;

  @Column()
  sctime: Date;

}
