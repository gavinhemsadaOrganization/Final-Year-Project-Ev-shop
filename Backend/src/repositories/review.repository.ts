import { IReview, Review } from "../models/Review";
import { ReviewDTO } from "../dtos/review.DTO";
import { withErrorHandling } from "../utils/CustomException";

export interface IReviewRepository {
  getReviewByTargetId(targetId: string): Promise<IReview[] | null>;
  getReviewsByReviewerId(reviewerId: string): Promise<IReview[] | null>;
  getReviewById(id: string): Promise<IReview | null>;
  createReview(reviewData: ReviewDTO): Promise<IReview | null>;
  getAllReviews(): Promise<IReview[] | null>;
  updateReview(
    id: string,
    reviewData: Partial<ReviewDTO>
  ): Promise<IReview | null>;
  deleteReview(id: string): Promise<boolean | null>;
}
export const ReviewRepository: IReviewRepository = {
  getAllReviews: withErrorHandling(async () => {
    return await Review.find().populate("order_id");
  }),
  getReviewByTargetId: withErrorHandling(async (targetId) => {
    return await Review.find({ target_id: targetId });
  }),
  getReviewsByReviewerId: withErrorHandling(async (reviewerId) => {
    return await Review.find({ reviewer_id: reviewerId });
  }),
  getReviewById: withErrorHandling(async (id) => {
    return await Review.findById(id);
  }),
  createReview: withErrorHandling(async (reviewData) => {
    const review = new Review(reviewData);
    return await review.save();
  }),
  updateReview: withErrorHandling(async (id, reviewData) => {
    return await Review.findByIdAndUpdate(id, reviewData, { new: true });
  }),
  deleteReview: withErrorHandling(async (id) => {
    const result = await Review.findByIdAndDelete(id);
    return result ? true : false;
  }),
};
