import { Request, Response } from "express";
import { IReviewService } from "../services/review.service";
import { handleResult, handleError } from "../utils/Respons.util";

export interface IReviewController {
  getAllReviews(req: Request, res: Response): Promise<Response>;
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
    getAllReviews: async (_req, res) => {
      try {
        const result = await reviewService.getAllReviews();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getting all reviews");
      }
    },
    getReviewByTargetId: async (req, res) => {
      try {
        const { targetId } = req.params;
        const result = await reviewService.getReviewByTargetId(targetId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getting reviews by target id");
      }
    },
    getReviewsByReviewerId: async (req, res) => {
      try {
        const { reviewerId } = req.params;
        const result = await reviewService.getReviewsByReviewerId(reviewerId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getting reviews by reviewer id");
      }
    },
    getReviewById: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await reviewService.getReviewById(id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getting review by id");
      }
    },
    createReview: async (req, res) => {
      try {
        const result = await reviewService.createReview(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "creating review");
      }
    },
    updateReview: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await reviewService.updateReview(id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updating review");
      }
    },
    deleteReview: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await reviewService.deleteReview(id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleting review");
      }
    },
  };
}
