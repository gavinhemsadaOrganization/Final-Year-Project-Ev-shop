import { validateDto } from "../../shared/middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IReviewController } from "./review.controller";
import { ReviewDTO } from "../../dtos/review.DTO";
import { container } from "../../di/container";

/**
 * Factory function that creates and configures the router for review-related endpoints.
 * It resolves the review controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for review management.
 */
export const reviewRouter = (): Router => {
  const router = Router();
  // Resolve the review controller from the DI container.
  const reviewController =
    container.resolve<IReviewController>("ReviewController");

  /**
   * @route GET /api/reviews/reviews
   * @description Retrieves a list of all reviews.
   * @access Public
   */
  router.get("/reviews", (req, res) =>
    reviewController.getAllReviews(req, res)
  );

  /**
   * @route GET /api/reviews/reviews/target/:targetId
   * @description Retrieves all reviews for a specific target entity (e.g., a seller or product).
   * @access Public
   */
  router.get("/reviews/target/:targetId", (req, res) =>
    reviewController.getReviewByTargetId(req, res)
  );

  /**
   * @route GET /api/reviews/reviews/reviewer/:reviewerId
   * @description Retrieves all reviews written by a specific user.
   * @access Public
   */
  router.get("/reviews/reviewer/:reviewerId", (req, res) =>
    reviewController.getReviewsByReviewerId(req, res)
  );

  /**
   * @route GET /api/reviews/review/:id
   * @description Retrieves a single review by its unique ID.
   * @access Public
   */
  router.get("/review/:id", (req, res) =>
    reviewController.getReviewById(req, res)
  );

  /**
   * @route POST /api/reviews/review
   * @description Creates a new review.
   * @middleware validateDto(ReviewDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/review", validateDto(ReviewDTO), (req, res) =>
    reviewController.createReview(req, res)
  );

  /**
   * @route PUT /api/reviews/review/:id
   * @description Updates an existing review.
   * @middleware validateDto(ReviewDTO) - Validates the request body.
   * @access Private (User who wrote the review, or Admin)
   */
  router.put("/review/:id", validateDto(ReviewDTO), (req, res) =>
    reviewController.updateReview(req, res)
  );

  /**
   * @route DELETE /api/reviews/review/:id
   * @description Deletes a review by its unique ID.
   * @access Private (User who wrote the review, or Admin)
   */
  router.delete("/review/:id", (req, res) =>
    reviewController.deleteReview(req, res)
  );
  return router;
};
