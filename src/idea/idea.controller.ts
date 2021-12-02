import { Controller,Get, Delete, Post, Put, Body, Param, UsePipes, Logger} from '@nestjs/common';
import { get } from 'http';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('api/idea')
export class IdeaController {
    constructor(private ideaService: IdeaService){}
    private logger = new Logger("IdeaController");
    @Get()
    showAllIdeas(){
        return this.ideaService.showAll();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createIdea(@Body() data:IdeaDTO){
        this.logger.log(JSON.stringify(data));
        return this.ideaService.create(data);
    }

    @Get(":id")
    readIdea(@Param("id") id:string){
        return this.ideaService.read(id);        
    }

    @Put(":id")
    @UsePipes(new ValidationPipe())
    UpdateIdea(@Param("id") id:string, @Body() data: Partial<IdeaDTO>){
        this.logger.log(JSON.stringify(data));
        return this.ideaService.update(id,data);
    }

    @Delete(":id")
    destroyIdea(@Param("id") id:string){
        
        return this.ideaService.destroy(id);
    }

    @Delete()
    destroyAll(){
        return this.ideaService.deleteAll();
    }
}
