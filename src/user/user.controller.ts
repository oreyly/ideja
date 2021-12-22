import {Body, Controller, Delete, Get, Logger, Post, UseGuards, UsePipes} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from './user.decorator';

@Controller()
export class UserController {
    constructor(private userService: UserService){

    }

    @Get("api/users")
    @UseGuards(new AuthGuard())
    showAllUsers(){
        return this.userService.showAll();
    }

    @Post("login")
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDTO){
        return this.userService.login(data);
    }

    @Post("register")
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDTO)
    {
        return this.userService.register(data);
    }

    @Delete("register")
    destroyAll()
    {
        return this.userService.deleteAll();
    }
}