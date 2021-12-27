import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { IdeaResolver } from './idea.resolver';
import { CommentEntity } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaResolver, CommentService]
})
export class IdeaModule {}
