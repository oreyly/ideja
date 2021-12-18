import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { Votes } from 'src/shared/votes.enum';
import { UserEntity } from 'src/user/user.entity';

import { Repository } from 'typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity)  
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity) 
        private userRepository: Repository<UserEntity>
    )
    {}

    private toResponseObject(idea: IdeaEntity):IdeaRO
    {
        Logger.log(idea.author);
        const responseObject: any = { ...idea, author: idea.author.toResponseObject(false) };
        if(responseObject.upvoty)
        {
            responseObject.upvoty = idea.upvoty.length;
        }
        if(responseObject.downvoty)
        {
            responseObject.downvoty = idea.downvoty.length;
        }
        return responseObject;
    }

    private ensureOwnership(idea: IdeaEntity, userId: string)
    {
        if(idea.author.id !== userId)
        {
            throw new HttpException("Incorrect user", HttpStatus.UNAUTHORIZED);
        }
    }

    private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
        Logger.log(idea[opposite]);
        if (
            idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
            idea[vote].filter(voter => voter.id === user.id).length > 0
        ) {
            idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
            idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
            await this.ideaRepository.save(idea);
        } else if (idea[vote].filter(voter => voter.id === user.id).length < 1)
        {
            idea[vote].push(user);
            await this.ideaRepository.save(idea);
        } else {
            throw new HttpException(
                "Unable to cast vote",
                HttpStatus.BAD_REQUEST
            );
        }

        return idea;
    }

    async showAll(): Promise<IdeaRO[]>
    {
        const ideas = await this.ideaRepository.find({relations:["author","upvoty","downvoty"]});
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async create(userId: string,data: IdeaDTO): Promise<IdeaRO>
    {
        const user = await this.userRepository.findOne({where:{id:userId}});
        const idea = this.ideaRepository.create({...data, author:user});
        await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    } 

    async read(id: string): Promise<IdeaRO>{
        const idea =  await this.ideaRepository.findOne({where: {id}, relations: ["author","upvoty","downvoty"]});
        if(!idea)
        {
            throw new HttpException("Not found!", HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(idea);
    }

    async update(id:string, userId: string, data: Partial<IdeaDTO>):Promise<IdeaRO>
    {
        let idea = await this.ideaRepository.findOne({where: {id}, relations:["author"]});
        if(!idea)
        {
            throw new HttpException("Not found!", HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.update({id},data);
        idea = await this.ideaRepository.findOne({where:{id},relations:["author"]});
        return this.toResponseObject(idea);
    }

    async destroy(id:string, userId: string)
    {
        const idea = await this.ideaRepository.findOne({where: {id}, relations:["author"]});
        if(!idea)
        {
            throw new HttpException("Not found!", HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.delete({id});
        return this.toResponseObject(idea);
    }

    async deleteAll()
    {
        return (await this.ideaRepository.find()).forEach(element => {

            this.ideaRepository.delete(element.id);
        });
    }

    async upvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ["author", "upvoty", "downvoty"] });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        idea = await this.vote(idea, user, Votes.UP);
        return this.toResponseObject(idea);
    }

    async downvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ["author", "upvoty", "downvoty"] });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        idea = await this.vote(idea, user, Votes.DOWN);
        return this.toResponseObject(idea);
    }

    async bookmark(id:string,userID: string){
        const idea = await this.ideaRepository.findOne({where:{id}});
        const user = await this.userRepository.findOne({where:{id:userID}, relations:["bookmarky"]})

        if (user.bookmarky.filter(bookmark => bookmark.id === idea.id).length < 1)
        {
            user.bookmarky.push(idea);
            await this.userRepository.save(user);
        }
        else
        {
            throw new HttpException(
                "Idea already bookmarked",
                HttpStatus.BAD_REQUEST
            );
        }

        return user.toResponseObject();
    }

    async unbookmark(id: string, userID: string)
    {
        const idea = await this.ideaRepository.findOne({where:{id}});
        const user = await this.userRepository.findOne({ where: { id: userID }, relations: ["bookmarky"] })
        
        if (user.bookmarky.filter(bookmark => bookmark.id === idea.id).length > 0)
        {
            user.bookmarky = user.bookmarky.filter(bookmark => bookmark.id !== idea.id)
            await this.userRepository.save(user);
        }
        else
        {
            throw new HttpException(
                "Idea already bookmarked",
                HttpStatus.BAD_REQUEST
            );
        }

        return user.toResponseObject();
    }
}