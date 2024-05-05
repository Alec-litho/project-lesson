import { Controller, Post, Sse, Body, Param, Get, HttpException,HttpStatus} from "@nestjs/common";
import { interval, map, Observable, fromEvent } from "rxjs";
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationService } from "./notifications.service";
import { CreateNotificationDTO } from "./dto/CreateNotificationDTO";
import { NotificationDocument } from "./entities/notification.entity";

@Controller("notifications")
export class NotificationController {
    constructor(
        private eventEmitter: EventEmitter2,
        private service: NotificationService
    ){}

    @ApiOperation({summary:"allows us to propagate real-time updates"})
    @Sse("/listen_for/:id")
    sse(@Param("id") id: string): Observable<MessageEvent> {
        console.log("18",id)
        return fromEvent(this.eventEmitter, `notification_for_${id}`).pipe(
            map((data) => {
                console.log("data",data)
                return new MessageEvent(`notification_for_${id}`, data)
            }) 
        )
    }
    @ApiOperation({summary:"create and send notification message"})
    @Post("/")
    async createNotificationMessage(@Body() dto: CreateNotificationDTO) { 
        const notification = await this.service.createNotificationMessage(dto);
        const isSent = this.service.sendNotificationMessage(dto.sentTo,notification)
        if(isSent) {
            return notification
        } else {
            throw new HttpException("something went wrong while sending notification", HttpStatus.BAD_REQUEST)
        }
  
    }
    @ApiOperation({summary:"set notification message status to viewed"})
    @Get("/updateViewedMessage/:id")
    updateViewedMessages(@Param("id") id: string) {
        console.log("id --> ", id)
        this.service.updateViewedMessage(id)
    }  
    @ApiOperation({summary:"accept notification message"}) 
    @Get("/accept/:id")
    async acceptNotification(@Param("id") id: string) {
        const response = await this.service.acceptNotification(id)
        return response
    }
    @ApiOperation({summary:"discard notification message"}) 
    @Get("/discard/:id")
    async discardNotification(@Param("id") id: string) {
        const response = await this.service.discardNotification(id)
        return response
    }
    @ApiOperation({summary:"get notification messages"}) 
    @Get("/get/:id/:num")
    async getNotificationMessages(@Param("id") id: string, @Param("num") messageNum: number) {
        console.log("id getNotifi --> ",id)
        const response = await this.service.getNotificationMessages(id, messageNum)
        return response
    }
}

/*Notification type
- friend request
- message from person
- like from person (post)
- 





*/