import { CommentEntity } from "src/comment/comment.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("idea")
export class IdeaEntity {
    @PrimaryGeneratedColumn("uuid") id:string;

    @CreateDateColumn() created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column("text") idea: string;

    @Column("text") description: string;

    @ManyToOne(type => UserEntity, author => author.ideas)
    author:UserEntity;

    @ManyToMany(type => UserEntity, {cascade:true})
    @JoinTable()
    upvoty: UserEntity[];

    @ManyToMany(type => UserEntity, {cascade:true})
    @JoinTable()
    downvoty: UserEntity[];

    @OneToMany(type => CommentEntity, comment => comment.idea)
    @JoinTable()
    comments: CommentEntity[];
}