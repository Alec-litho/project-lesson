import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            let authHeader = req.headers.authorization;
            const bearer:string = authHeader.split(' ')[0];
            const token:string = authHeader.split(' ')[1]
            
            if(bearer !== "Bearer" || !token) {
                throw new UnauthorizedException("User is not authorized")
            };
            console.log(token);
            
            const user = await this.jwtService.verifyAsync(token);      
            req.user = user;
            return true
        } catch (error) {
            console.log(error);
            
            throw new UnauthorizedException(error)
        }
    }
}