import { IReview, Review } from "../models/Review";
import { ReviewDTO } from "../dtos/review.DTO";

export interface IReviewRepository {
  getReviewByTargetId(targetId: string): Promise<IReview[]>;
  getReviewsByReviewerId(reviewerId: string): Promise<IReview[]>;
  getReviewById(id: string): Promise<IReview | null>;
  createReview(reviewData: ReviewDTO): Promise<IReview>;
  updateReview(
    id: string,
    reviewData: Partial<ReviewDTO>
  ): Promise<IReview | null>;
  deleteReview(id: string): Promise<boolean>;
}
export const ReviewRepository: IReviewRepository = {
  getReviewByTargetId: async (targetId) => {
    return await Review.find({ target_id: targetId });
  },
  getReviewsByReviewerId: async (reviewerId) => {
    return await Review.find({ reviewer_id: reviewerId });
  },
  getReviewById: async (id) => {
    return await Review.findById(id);
  },
  createReview: async (reviewData) => {
    const review = new Review(reviewData);
    return await review.save();
  },
  updateReview: async (id, reviewData) => {
    return await Review.findByIdAndUpdate(id, reviewData, { new: true });
  },
  deleteReview: async (id) => {
    const result = await Review.findByIdAndDelete(id);
    return result ? true : false;
  },
};
