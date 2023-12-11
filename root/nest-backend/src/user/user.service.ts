import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import getAge from '../../utils/getAge'; //rewrite this func in fe
import { JwtService } from '@nestjs/jwt';
import {User, UserDocument} from './entities/user.entity'
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import { Album } from 'src/album/entities/album.entity';
import { LoginUserDto } from './dto/login-user.dto';
import bcrypt, { genSaltSync, hashSync } from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
    @InjectModel(User.name) private readonly userModel: Model <User>,
    private jwtService: JwtService

    ) {} 

  async register(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.userModel.find({email:createUserDto.email})
      
      if(userExists.length!==0) throw new BadRequestException({message: "User already exists"})
      const hashPassword = bcrypt.hash(createUserDto.password, 5);
      const model = new this.userModel({...createUserDto, password:hashPassword})
      const user = await model.save();
      const access_token =  await this.jwtService.signAsync({sub:user._id,username:user.fullName});
      const newAlbum = new this.albumModel({name: "All", user: user._id})
      newAlbum.save();
      return {access_token, id:user._id.toString()}
  } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async login(loginUserDto: LoginUserDto)/*:Promise<User|ServiceResponse>*/ {
    try {
      const user:any = await this.userModel.findOne({email:loginUserDto.email});
      if(!user) {
        throw new NotFoundException({message: "User not found"})
      } else if(!this.comparePass(loginUserDto, user)) {
        throw new UnauthorizedException({message:"password doesn't match"});
      }
      const access_token =  await this.jwtService.signAsync({sub:user._id,username:user.fullName});
      return {message: "success", value: {access_token,id:user._id}}; 
    }catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findAll() {
    return this.userModel.find();
  }

  async getUser(id: string)/*:Promise<User|ServiceResponse>*/ {
    try {
      console.log(id);
      
      const user:any = await this.userModel.findById(id);
      if(!user) throw new NotFoundException({message: "User not found"});
      return {message:'success', value: user};
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  hashPassword(password:string) {
    return hashSync(password, genSaltSync(10));
  }
  private async comparePass(loginUserDto: LoginUserDto, user: User) {
    console.log(loginUserDto.password, user.password);
    const passCompare = true //ILL FIX IT LATER
    // const passCompare = await bcrypt.compare(loginUserDto.password, user.password);
    return passCompare? true : false;
  }
}
