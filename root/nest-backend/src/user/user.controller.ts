import { Controller, Get, Post, Body, Patch, Param, Delete,ValidationPipe, Res, UsePipes, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from "express";
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @UsePipes(new ValidationPipe())
  @Post("/register")
  @ApiOperation({summary:"Register user"})
  @ApiResponse({status:201,type:User})
  async create(@Body() user: CreateUserDto, @Res() res: Response) {
    console.log(user);
    const result = await this.userService.register(user);
    res.cookie("token", result.access_token);
    res.cookie("id", result.id);
    res.json({token:result.access_token, _id:result.id});
  } 

  @Get(":id")
  @ApiOperation({summary:"Get user"})
  @ApiResponse({status:201,type:User})
  @UseGuards(JwtAuthGuard)
  async getUser(@Param("id") id:string, @Res() res: Response) {
    const result = await this.userService.getUser(id);
    res.json(result.value);
  } 

  @Post("/login")
  @ApiOperation({summary:"Log in user"})
  @ApiResponse({status:201})
  @UsePipes(ValidationPipe)
  async login(@Body() loginUserDto:LoginUserDto, @Res({passthrough:true}) res: Response) {
    const result = await this.userService.login(loginUserDto);
    res.cookie("token", result.value.access_token, { httpOnly: true, secure: false, "path": "/"});
    res.cookie("id", result.value.id, { httpOnly: true, secure: false, "path": "/" });
    res.json({token:result.value.access_token, _id:result.value.id}).status(201);
  }

}
