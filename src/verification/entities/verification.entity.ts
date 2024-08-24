// verification-token.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id: number;

  // Although ManyToOne will create a column named userId,
  // I want a Verification.userId ability hence this
  @Column()
  userId: number;

  @ManyToOne(() => User)
  // @JoinColumn({ name: 'userId' }) // will be userId by default
  user: User;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
