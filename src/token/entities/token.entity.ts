import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryColumn()
  jti: string;

  @Column({ type: 'timestamp with time zone' })
  exp: Date;
}
