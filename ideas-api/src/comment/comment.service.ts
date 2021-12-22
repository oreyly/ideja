import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
        @InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) { }
    
    private toResponseObject(comment: CommentEntity)
    {
        const responseObject: any = comment;
        if (comment.author)
        {
            responseObject.author = comment.author.toResponseObject();
        }

        return responseObject;
    }
    
    async showByIdea(id: string, page: number = 1) {
        const comments = await this.commentRepository.find({
            where: { idea: { id } },
            relations: ["author"],
            take: 25,
            skip: 25*(page-1)
        });

        return comments.map(comm => this.toResponseObject(comm));
    }
    
    async showByUser(id: string, page: number = 1) {
        const comments = await this.commentRepository.find({
            where: { author: { id } },
            relations: ["author"],
            take: 25,
            skip: 25*(page-1)
        });

        return comments.map(comm => this.toResponseObject(comm));
    }

    async show(id: string) {
        
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ["idea"] });

        return this.toResponseObject(comment);
    }

    async create(ideaId: string, userId: string, data: CommentDTO) {
        const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        Logger.log(await this.ideaRepository.count());
        Logger.log(JSON.stringify(idea));
        Logger.log(userId);

        const neco = {
            ...data,
            author: user,
            idea
        };
        const comment = this.commentRepository.create(neco);

        //comment.idea = idea;
        //comment.author = user;

        Logger.log(comment.idea);
        Logger.log(comment.author);
        //Logger.log(comment.author);

        await this.commentRepository.save(comment);
        return this.toResponseObject(comment);
    }

    async destroy(id: string, userId: string)
    {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ["author", "idea"]
        });

        /*if (comment.author.id != userId) {
            throw new HttpException("Tohle není tvůj koment", HttpStatus.UNAUTHORIZED);
        }*/

        await this.commentRepository.remove(comment);
        return this.toResponseObject(comment);
    }

    async deleteAll()
    {
        return (await this.commentRepository.find()).forEach(element => {

            this.commentRepository.delete(element.id);
        });
    }
}
