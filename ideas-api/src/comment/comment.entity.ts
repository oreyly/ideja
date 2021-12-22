import { IdeaEntity } from "src/idea/idea.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("comment")
export class CommentEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @CreateDateColumn()
    created: Date;

    @Column("text")
    comment: string;

    @ManyToOne(() => UserEntity, usr => usr.comments, { cascade: true })
    @JoinTable()
    author: UserEntity;

    @ManyToOne(() => IdeaEntity, ida => ida.comments, { cascade: true })
    @JoinTable()
    idea: IdeaEntity;
}