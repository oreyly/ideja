import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from 'src/user/user.decorator';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Get("idea/:id")
    showCommentsByIdea(@Param("id") idea: string, @Query("page") page:number) {
        return this.commentService.showByIdea(idea, page);
    }
    
    @Get("user/:id")
    showCommentsByUser(@Param("id") user: string, @Query("page") page:number) {
        return this.commentService.showByUser(user, page);
     }

    @Post("idea/:id")
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createComment(@Param("id") idea: string, @User("id") user: string, @Body() data: CommentDTO) {
        return this.commentService.create(idea, user, data);
    }

    @Get(":id")
    @UseGuards(new AuthGuard())
    showComment(@Param("id") id: string) {
        return this.commentService.show(id);
    }
    
    @Delete("id")
    @UseGuards(new AuthGuard())
    destroyComment(@Param("id") id: string, @User("id") user: string) {
        return this.commentService.destroy(id, user);
    }

    @Delete()
    destroyAll() {
        return this.commentService.deleteAll();
    }
}
