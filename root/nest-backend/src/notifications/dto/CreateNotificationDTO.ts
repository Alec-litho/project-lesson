import { ApiProperty } from "@nestjs/swagger"


export class CreateNotificationDTO {
    @ApiProperty({example: "Friend request was sent to you from...",description:"notification message text"})
    text: string
    @ApiProperty({example: "{description: Friend request, image: http://imgbb.com/image-14532-id-9842}",description:"notification type"})
    type: {description: string, imageUrl: string}
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"user who sent notification message"})
    sentBy:string;
    @ApiProperty({example: "656395f24db3c1a422c2e8c9",description:"user who received notification message"})
    sentTo:string;
}