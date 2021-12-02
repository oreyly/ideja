import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';

import { Repository } from 'typeorm';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {
    constructor(@InjectRepository(IdeaEntity)  
    private ideaRepository: Repository<IdeaEntity>)
    {}

    showAll()
    {
        return this.ideaRepository.find();
    }

    async create(data: IdeaDTO)
    {
        const idea = this.ideaRepository.create(data);
        await this.ideaRepository.save(idea);
        return idea;
    } 

    async read(id: string){
        const idea =  await this.ideaRepository.findOne({where: {id}});
        if(!idea)
        {
            throw new HttpException("Not found!", HttpStatus.NOT_FOUND);
        }
        return idea;
    }

    async update(id:string, data: Partial<IdeaDTO>)
    {
        const idea = await this.ideaRepository.findOne({where: {id}});
        if(!idea)
        {
            throw new HttpException("Not found!", HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.update({id},data);
        return await this.ideaRepository.findOne({id});
    }

    async destroy(id:string)
    {
        const idea = await this.ideaRepository.findOne({where: {id}});
        if(!idea)
        {
            throw new HttpException("Not found!", HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.delete({id});
        return idea;
    }

    async deleteAll()
    {
        return (await this.ideaRepository.find()).forEach(element => {

            this.ideaRepository.delete(element.id);
        });
    }
}