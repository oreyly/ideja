import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';

@Module({
  imports:[TypeOrmModule.forFeature([IdeaEntity,UserEntity,CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService, CommentResolver]
})
export class CommentModule {}
