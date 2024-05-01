import { Controller, Post, Sse, Body, Param, Get} from "@nestjs/common";
import { interval, map, Observable, fromEvent } from "rxjs";
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationService } from "./notifications.service";
import { CreateNotificationDTO } from "./dto/CreateNotificationDTO";

@Controller("notifications")
export class NotificationController {
    constructor(
        private eventEmitter: EventEmitter2,
        private service: NotificationService
    ){}

    @ApiOperation({summary:"allows us to propagate real-time updates"})
    @Sse("/listen_for/:id")
    sse(@Param("id") id: string): Observable<MessageEvent> {
        console.log(id)
        return fromEvent(this.eventEmitter, `friend_request_to_${id}`).pipe(
            map((data) => {
                return new MessageEvent(`friend_request_to_${id}`, data)
            }) 
        )
    }
    @ApiOperation({summary:"create and send notification message"})
    @Post("/")
    async createNotificationMessage(@Body() dto: CreateNotificationDTO) { 
        const result = await this.service.createNotificationMessage(dto);
        return result;    }
    @ApiOperation({summary:"set notification message status to viewed"})
    @Get("/updateViewedMessage/:id")
    updateViewedMessages(@Param("id") id: string) {
        console.log("id --> ", id)
        this.service.updateViewedMessage(id)
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