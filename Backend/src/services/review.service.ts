import {IReviewRepository} from "../repositories/review.repository";
import {ReviewDTO} from "../dtos/review.DTO";
import {IUserRepository} from "../repositories/user.repository";

export interface IReviewService {
    getAllReviews(): Promise<{ success: boolean; reviews?: any[]; error?: string }>;
    getReviewByTargetId(targetId: string): Promise<{ success: boolean; reviews?: any[]; error?: string }>;
    getReviewsByReviewerId(reviewerId: string): Promise<{ success: boolean; reviews?: any[]; error?: string }>;
    getReviewById(id: string): Promise<{ success: boolean; review?: any; error?: string }>;
    createReview(reviewData: ReviewDTO): Promise<{ success: boolean; review?: any; error?: string }>;
    updateReview(id: string, reviewData: Partial<ReviewDTO>): Promise<{ success: boolean; review?: any; error?: string }>;
    deleteReview(id: string): Promise<{ success: boolean; error?: string }>;
}

export function reviewService(reviewRepo: IReviewRepository, userRepo: IUserRepository): IReviewService {
    return {
        getAllReviews: async () => {
            try {
                const reviews = await reviewRepo.getAllReviews();
                return {success: true, reviews};
            }
            catch(err) {
                return {success: false, error: "Failed to fetch reviews"};
            }
        },

        getReviewByTargetId: async (targetId: string) => {
            try {
                const reviews = await reviewRepo.getReviewByTargetId(targetId);
                return {success: true, reviews};
            }
            catch (err) {
                return {success: false, error: "Failed to fetch reviews for the target"};
            }
        },
        getReviewsByReviewerId: async (reviewerId: string) => {
            try {
                const reviews = await reviewRepo.getReviewsByReviewerId(reviewerId);
                return {success: true, reviews};
            }
            catch (err) {
                return {success: false, error: "Failed to fetch reviews by the reviewer"};
            }
        },
        getReviewById: async (id: string) => {
            try {
                const review = await reviewRepo.getReviewById(id);
                if (!review) return {success: false, error: "Review not found"};
                return {success: true, review};
            }
            catch (err) {
                return {success: false, error: "Failed to fetch review"};
            }
        },
        createReview: async (reviewData: ReviewDTO) => {
            try {
                const reviewer = await userRepo.findById(reviewData.reviewer_id);
                if (!reviewer) return {success: false, error: "Reviewer not found"};
                const review = await reviewRepo.createReview(reviewData);
                return {success: true, review};
            }
            catch (err) {
                return {success: false, error: "Failed to create review"};
            }
        },
        updateReview: async (id: string, reviewData: Partial<ReviewDTO>) => {
            try {
                const review = await reviewRepo.updateReview(id, reviewData);
                if (!review) return {success: false, error: "Review not found"};
                return {success: true, review};
            }
            catch (err) {
                return {success: false, error: "Failed to update review"};
            }
        },
        deleteReview: async (id: string) => {
            try {
                const success = await reviewRepo.deleteReview(id);
                if (!success) return {success: false, error: "Review not found"};
                return {success: true};
            }
            catch (err) {
                return {success: false, error: "Failed to delete review"};
            }
        },
    };
}