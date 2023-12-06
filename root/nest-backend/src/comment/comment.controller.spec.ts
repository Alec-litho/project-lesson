import { Test } from '@nestjs/testing';
import { CommentController } from './comment.controller';

describe(' Test suite', () => {
    let Controller: CommentController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [CommentController],
        }).compile();

        Controller = module.get<CommentController>(CommentController);
        Controller
    });

    it('should be defined', () => {
        expect(Controller).toBeDefined();
    });
});