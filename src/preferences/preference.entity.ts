import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export interface NewsSource {
  source: string;
  criteria: string[];
}

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  apiKey: string;

  @Column('json', {
    nullable: true,
  })
  sources: NewsSource[];
}
