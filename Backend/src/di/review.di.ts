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

container.register<IReviewRepository>("IReviewRepository", {
  useValue: ReviewRepository,
});
container.register<IReviewService>("IReviewService", {
  useFactory: (c) =>
    reviewService(c.resolve<IReviewRepository>("IReviewRepository")),
});
container.register<IReviewController>("IReviewController", {
  useFactory: (c) =>
    reviewController(c.resolve<IReviewService>("IReviewService")),
});

export { container };
