import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
  controllers: [IdeaController],
  providers: [IdeaService]
})
export class IdeaModule {}
