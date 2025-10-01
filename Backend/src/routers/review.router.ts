import { validateDto } from "../middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IReviewController } from "../controllers/review.controller";
import { ReviewDTO } from "../dtos/review.DTO";
import { container } from "../di/review.di";

export const reviewRouter = (): Router => {
  const router = Router();
  const reviewController =
    container.resolve<IReviewController>("IReviewController");
  router.get("/reviews", (req, res) =>
    reviewController.getAllReviews(req, res)
  );
  router.get("/reviews/target/:targetId", (req, res) =>
    reviewController.getReviewByTargetId(req, res)
  );
  router.get("/reviews/reviewer/:reviewerId", (req, res) =>
    reviewController.getReviewsByReviewerId(req, res)
  );
  router.get("/review/:id", (req, res) =>
    reviewController.getReviewById(req, res)
  );
  router.post("/review", validateDto(ReviewDTO), (req, res) =>
    reviewController.createReview(req, res)
  );
  router.put("/review/:id", validateDto(ReviewDTO), (req, res) =>
    reviewController.updateReview(req, res)
  );
  router.delete("/review/:id", (req, res) =>
    reviewController.deleteReview(req, res)
  );
  return router;
};
