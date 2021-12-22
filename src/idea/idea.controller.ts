import { Controller,Get, Delete, Post, Put, Body, Param, UsePipes, Logger, UseGuards, Query} from '@nestjs/common';
import { get } from 'http';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { userInfo } from 'os';

@Controller('api/ideas')
export class IdeaController {
    constructor(private ideaService: IdeaService){}


    private logData(options: any)
    {
        Logger.log("Tady");
        options.user && this.logger.log("USER" + JSON.stringify(options.user));
        options.data && this.logger.log("DATA" + JSON.stringify(options.data));
        options.id && this.logger.log("IDEA" + JSON.stringify(options.id));
    }

    private logger = new Logger("IdeaController");
    @Get()
    showAllIdeas(@Query("page") page: number){
        return this.ideaService.showAll(page);
    }

    @Get("/newest")
    showNewestIdeas(@Query("page") page: number)
    {
        return this.ideaService.showAll(page, true);
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createIdea(@User("id") user,@Body() data:IdeaDTO){
        this.logData({user,data});
        return this.ideaService.create(user, data);
    }

    @Get(":id")
    readIdea(@Param("id") id:string){
        return this.ideaService.read(id);        
    }

    @Put(":id")
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    UpdateIdea(@Param("id") id:string,@User("id") user:string, @Body() data: Partial<IdeaDTO>){
        this.logger.log({id,user,data});
        return this.ideaService.update(id, user, data);
    }

    @Delete(":id")
    @UseGuards(new AuthGuard())
    destroyIdea(@Param("id") id:string, @User("id") user: string){
        
        this.logData({id,user});
        return this.ideaService.destroy(id,user);
    }

    @Delete()
    destroyAll() {
        return this.ideaService.deleteAll();
    }

    @Post(":id/upvote")
    @UseGuards(new AuthGuard())
    upvoteIdea(@Param("id") id: string, @User("id") user:string)
    {
        this.logData({ id, user });
        return this.ideaService.upvote(id, user);
    }

    @Post(":id/downvote")
    @UseGuards(new AuthGuard())
    downvoteIdea(@Param("id") id: string, @User("id") user:string)
    {
        this.logData({id,user});
        return this.ideaService.downvote(id, user);
    }
    

    @Post(":id/bookmark")
    @UseGuards(new AuthGuard())
    bookmarkIdea(@Param("id") id:string, @User("id") user: string){
        this.logData({id,user});
        return this.ideaService.bookmark(id, user);
    }
    
    @Delete(":id/bookmark")
    @UseGuards(new AuthGuard())
    unbookmarkIdea(@Param("id") id:string, @User("id") user: string){
        this.logData({id,user});
        return this.ideaService.unbookmark(id, user);
    }
}
