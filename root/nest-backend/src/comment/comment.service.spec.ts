import { Test } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PostModule } from '../post/post.module';

describe(' Test suite', () => {
    let Service: CommentService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [CommentService],
            imports: [PostModule]
        }).compile();

        Service = module.get<CommentService>(CommentService);
    });

    it('should be defined', () => {
        expect(Service).toBeDefined();
    });
});