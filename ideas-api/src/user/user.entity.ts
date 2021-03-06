import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserRO } from "./user.dto";
import { IdeaEntity } from "src/idea/idea.entity";
import { type } from "os";
import { CommentEntity } from "src/comment/comment.entity";

@Entity("user")
export class UserEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column({
        type: "text",
        unique: true
    })
    username: string;

    @Column("text")
    password: string;

    @OneToMany(type => IdeaEntity, idea => idea.author)
    ideas: IdeaEntity[];

    @ManyToMany(type => IdeaEntity, {cascade:true})
    @JoinTable()
    bookmarky: IdeaEntity[];

    @OneToMany(type => CommentEntity, com => com.author)
    @JoinTable()
    comments: CommentEntity[];

    @BeforeInsert()
    async hashPassword()
    {
        this.password = await bcrypt.hash(this.password, 10)
    }

    toResponseObject(showToken: boolean = true): UserRO
    {
        const {id, created, username, token} = this;
        const responseObject: any = {id, created, username};
        if(showToken){
           responseObject.token = token;
        }
        if(this.ideas)
        {
            responseObject.ideas = this.ideas;
        }
        if(this.bookmarky)
        {
            responseObject.bookmarky = this.bookmarky;
        }
        return responseObject;
    }

    async comparePassword(attempt: string)
    {
        return await bcrypt.compare(attempt, this.password);
    }

    private get token(){
        const {id, username} = this;
        return jwt.sign({
            id, username
        },process.env.SECRET, {expiresIn: "7d"})
    }

}