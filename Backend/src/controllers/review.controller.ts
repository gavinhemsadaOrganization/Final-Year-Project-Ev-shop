import { Request, Response } from "express";
import { IReviewService } from "../services/review.service";
import logger from "../utils/logger";

export interface IReviewController {
  getReviewByTargetId(req: Request, res: Response): Promise<Response>;
  getReviewsByReviewerId(req: Request, res: Response): Promise<Response>;
  getReviewById(req: Request, res: Response): Promise<Response>;
  createReview(req: Request, res: Response): Promise<Response>;
  updateReview(req: Request, res: Response): Promise<Response>;
  deleteReview(req: Request, res: Response): Promise<Response>;
}

export function reviewController(
  reviewService: IReviewService
): IReviewController {
  return {
    getReviewByTargetId: async (req, res) => {
      try {
        const { targetId } = req.params;
        const result = await reviewService.getReviewByTargetId(targetId);
        if (!result.success) {
          logger.warn(
            `Failed to get reviews by target ID: ${targetId} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully retrieved reviews for target ID: ${targetId}`);
        return res
          .status(200)
          .json({ message: "Reviews by target", result: result.reviews });
      } catch (err) {
        logger.error(`Error getting reviews by target ID: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    getReviewsByReviewerId: async (req, res) => {
      try {
        const { reviewerId } = req.params;
        const result = await reviewService.getReviewsByReviewerId(reviewerId);
        if (!result.success) {
          logger.warn(
            `Failed to get reviews by reviewer ID: ${reviewerId} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(
          `Successfully retrieved reviews by reviewer ID: ${reviewerId}`
        );
        return res
          .status(200)
          .json({ message: "Reviews by reviewer", result: result.reviews });
      } catch (err) {
        logger.error(`Error getting reviews by reviewer ID: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    getReviewById: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await reviewService.getReviewById(id);
        if (!result.success) {
          logger.warn(`Failed to get review by ID: ${id} - ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully retrieved review by ID: ${id}`);
        return res
          .status(200)
          .json({ message: "Review", result: result.review });
      } catch (err) {
        logger.error(`Error getting review by ID: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    createReview: async (req, res) => {
      try {
        const result = await reviewService.createReview(req.body);
        if (!result.success) {
          logger.warn(`Failed to create review - ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully created review`);
        return res
          .status(201)
          .json({ message: "Review created", result: result.review });
      } catch (err) {
        logger.error(`Error creating review: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updateReview: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await reviewService.updateReview(id, req.body);
        if (!result.success) {
          logger.warn(`Failed to update review ID: ${id} - ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully updated review ID: ${id}`);
        return res
          .status(200)
          .json({ message: "Review updated", result: result.review });
      } catch (err) {
        logger.error(`Error updating review: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    deleteReview: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await reviewService.deleteReview(id);
        if (!result.success) {
          logger.warn(`Failed to delete review ID: ${id} - ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully deleted review ID: ${id}`);
        return res.status(200).json({ message: "Review deleted" });
      } catch (err) {
        logger.error(`Error deleting review: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}
