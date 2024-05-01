import {Injectable} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationSchema, NotificationModel } from "./entities/notification.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { CreateNotificationDTO } from "./dto/CreateNotificationDTO";
import { HttpException, HttpStatus} from "@nestjs/common";

@Injectable()
export class NotificationService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        @InjectModel("Notification") private readonly notificationModel: Model<NotificationModel>
    ){}

    async getNotificationMessages(id:string, messageNum: number) {
        const mongooseId = new mongoose.Types.ObjectId(id)
        const notifications:NotificationModel[] = await this.notificationModel.find({sentTo:mongooseId})
            .skip(messageNum)
            .limit(15)
            .populate("sentBy", "fullName avatarUrl")
            console.log(notifications)
        return notifications
    }
    async updateViewedMessage(id:string):Promise<void> {
        const mongooseId = new mongoose.Types.ObjectId(id);
        const updatedModel = await this.notificationModel.findByIdAndUpdate(mongooseId, {viewed: true});
        console.log(updatedModel)
        if(updatedModel) updatedModel.save()
    }
    async createNotificationMessage(dto:CreateNotificationDTO) {
      
        const notificationMessage = {
            text: dto.text,
            type: dto.type,
            sentBy: new mongoose.Types.ObjectId(dto.sentBy),
            sentTo: new mongoose.Types.ObjectId(dto.sentTo),
            viewed: false
        }
        console.log(notificationMessage,dto)
        const notification = new this.notificationModel(notificationMessage);
        if(!notification) throw new HttpException("something went wrong while creating notification", HttpStatus.BAD_REQUEST);
        notification.save()
        this.eventEmitter.emit(`friend_request_to_${dto.sentTo}`)
        return notification
    }

}