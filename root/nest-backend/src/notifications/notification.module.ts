import { Module } from "@nestjs/common"
import { NotificationController } from "./notification.controller"
import { NotificationService } from "./notifications.service"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { MongooseModule } from "@nestjs/mongoose"
import { NotificationSchema } from "./entities/notification.entity"

@Module({
    imports: [
        EventEmitterModule.forRoot({global:true}),
        MongooseModule.forFeature([{name: "Notification", schema: NotificationSchema}])
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
})

export class NotificationModule {}