import {Injectable} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationSchema, NotificationModel, NotificationDocument } from "./entities/notification.entity";
import { User } from "../user/entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { CreateNotificationDTO } from "./dto/CreateNotificationDTO";
import { HttpException, HttpStatus} from "@nestjs/common";
import {notificationDescriptionGenerator} from '../../utils/notificationDescriptionList';


@Injectable()
export class NotificationService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        @InjectModel("Notification") private readonly notificationModel: Model<NotificationModel>,
        @InjectModel("User") private readonly userModel: Model<User>

    ){}

    async getNotificationMessages(id:string, messageNum: number) {
        const mongooseId = new mongoose.Types.ObjectId(id)
        const notifications:NotificationModel[] = await this.notificationModel.find({sentTo:mongooseId})
            .skip(messageNum)
            .limit(15)
            .populate("sentBy", "fullName avatarUrl")
            console.log("28",notifications)
        return notifications
    }
    async updateViewedMessage(id:string):Promise<void> {
        const mongooseId = new mongoose.Types.ObjectId(id);
        const updatedModel = await this.notificationModel.findByIdAndUpdate(mongooseId, {viewed: true});
        console.log(updatedModel)
        if(updatedModel) updatedModel.save()
    }
    async createNotificationMessage(dto:CreateNotificationDTO) {
        const [sentBy, sentTo] = [new mongoose.Types.ObjectId(dto.sentBy),new mongoose.Types.ObjectId(dto.sentTo)]
        const sender = await this.userModel.findById(sentBy)
        const description = notificationDescriptionGenerator(dto.type, sender.fullName)
        const notificationMessage = {
            text: description,
            type: dto.type,
            imageUrl:sender.avatarUrl,
            sentBy,
            sentTo,
            viewed: false
        };
        console.log(sender,notificationMessage,description);
        const notification: NotificationDocument  = new this.notificationModel(notificationMessage);
        if(!notification) throw new HttpException("something went wrong while creating notification", HttpStatus.BAD_REQUEST);
        await notification.save();
        return notification;
    }
    sendNotificationMessage(receiverId:string, message:NotificationDocument) {
        return this.eventEmitter.emit(`notification_for_${receiverId}`, message)

    }
    async discardNotification(notificationId:string) {
        const mongooseId = new mongoose.Types.ObjectId(notificationId)
        const notification = await this.notificationModel.findById(mongooseId)
        switch(notification.type) {
            case "friend_request":
                const dto = {type:"friend_request_discarded", text: "user discarded your friend request", sentBy:notification.sentTo.toString(), sentTo:notification.sentBy.toString()}
                this.createNotificationMessage(dto)
            break;
        }
    }
    async acceptNotification(notificationId:string) {
        const mongooseId = new mongoose.Types.ObjectId(notificationId)
        const notification = await this.notificationModel.findById(mongooseId)
        switch(notification.type) {
            case "friend_request":
                const users = await Promise.all([notification.sentBy, notification.sentTo].map(userId => this.userModel.findById(userId)))
                users.forEach((user,indx,users) => {
                    user.friends.push(users[indx===0?1:0]._id)
                    user.save()
                })
                const dto = {type:"friend_request_accepted", text:"user accepted your friend request", sentBy:notification.sentTo.toString(), sentTo:notification.sentBy.toString()}
                this.createNotificationMessage(dto)
            break;
        }
    }

}
