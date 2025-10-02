import { container } from "tsyringe";
import {
  IReviewController,
  reviewController,
} from "../controllers/review.controller";
import { IReviewService, reviewService } from "../services/review.service";
import {
  IReviewRepository,
  ReviewRepository,
} from "../repositories/review.repository";

container.register<IReviewRepository>("ReviewRepository", {
  useValue: ReviewRepository,
});
container.register<IReviewService>("ReviewService", {
  useFactory: (c) =>
    reviewService(c.resolve<IReviewRepository>("ReviewRepository")),
});
container.register<IReviewController>("ReviewController", {
  useFactory: (c) =>
    reviewController(c.resolve<IReviewService>("ReviewService")),
});

export { container };
