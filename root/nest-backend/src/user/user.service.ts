import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import getAge from '../../utils/getAge'; //rewrite this func in fe
import { JwtService } from '@nestjs/jwt';
import {User, UserDocument} from './entities/user.entity'
import mongoose, {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import { Album } from 'src/album/entities/album.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { genSaltSync, hashSync, genSalt, hash, compare } from 'bcryptjs';
import {getAge} from '../../utils/getUserAge'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
    @InjectModel(User.name) private readonly userModel: Model <User>,
    private jwtService: JwtService

    ) {} 

  async register(createUserDto: CreateUserDto) {
      const userExists = await this.userModel.findOne({email:createUserDto.email})
      
      if(userExists) throw new BadRequestException({message: "User already exists"});
      const salt = await genSalt(5);
      const hashPassword = await hash(createUserDto.password, salt);
      const age = getAge(createUserDto.birth);
      const model = new this.userModel({...createUserDto,age, password:hashPassword});
      const user = await model.save();
      const access_token = await this.jwtService.signAsync({sub:user._id,username:user.fullName});
      const newAlbum = new this.albumModel({name: "All", user: user._id});
      const album = await newAlbum.save();
      return {access_token, id:user._id.toString()};

  }
  async login(loginUserDto: LoginUserDto)/*:Promise<User|ServiceResponse>*/ {
    try {
      const user:User = await this.userModel.findOne({email:loginUserDto.email});
      if(!user) {
        throw new NotFoundException({message: "User not found"})
      } else if(!this.comparePass(loginUserDto, user)) {
        throw new UnauthorizedException({message:"password doesn't match"});
      }
      const access_token =  await this.jwtService.signAsync({sub:user._id,username:user.fullName});
      return {message: "success", value: {access_token,id:user._id.toString()}}; 
    }catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findAll() {
    return this.userModel.find();
  }

  async getMe(id: string)/*:Promise<User|ServiceResponse>*/ {
    try {
      const userId = new mongoose.Types.ObjectId(id)
      const user:User = await this.userModel.findById(userId);
      if(user===null) throw new NotFoundException("User not found");//somehow it triggers error in try catch block
      return {message:'success', value: user};
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getUser(id:string) {
    console.log("id",id);
    
    const userId = new mongoose.Types.ObjectId(id)
    const viewUserFields = "fullName location friends birth age gender avatarUrl _id"
    const user:User = await this.userModel.findById(userId).select(viewUserFields).populate({
      path: 'friends',
      select: viewUserFields
    })
    if(user===null) throw new NotFoundException("User not found");//somehow it triggers error in try catch block
    return {message:'success', value: user};
  }
  public async getPossibleFriends(id:string) {
    const friends = await this.userModel.find().limit(8).select("_id fullName avatarUrl");
    if(friends.length===0 || !friends) throw new NotFoundException("possible friends weren't found");
    
    return friends.filter(user => user._id.toString() !== id)
  }
  private async comparePass(loginUserDto: LoginUserDto, user: User) {
    const passCompare = await compare(loginUserDto.password, user.password);
    return passCompare
  }
}
