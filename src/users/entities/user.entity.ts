import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string; // assume we only accept email as username

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: 'inactive' })
  accountStatus: 'active' | 'inactive';

  @Column({ nullable: true })
  emailVerifiedAt: Date;
}
