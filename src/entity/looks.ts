import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Looks {
  @PrimaryGeneratedColumn()
  lookid: number;

  @Column()
  uid: number;

  @Column()
  pid: number;

  @Column()
  clicktime: Date;

}
