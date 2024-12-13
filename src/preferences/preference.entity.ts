import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export interface FilterCriteria {
  criteria: string;
}

export interface NewsSource {
  source: string;
  criteria: FilterCriteria[];
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
