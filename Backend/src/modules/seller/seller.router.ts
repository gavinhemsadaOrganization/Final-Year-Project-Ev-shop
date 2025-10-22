import { Router } from "express";
import { container } from "../../di/container";
import { validateDto } from "../../shared/middlewares/DtoValidator.middleware";
import { SellerDTO, UpdateSellerDTO } from "../../dtos/seller.DTO";
import { ISellerController } from "./seller.controller";

/**
 * Factory function that creates and configures the router for seller-related endpoints.
 * It resolves the seller controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for seller management.
 */
export const sellerRouter = (): Router => {
  const router = Router();
  // Resolve the seller controller from the DI container.
  const controller = container.resolve<ISellerController>("SellerController");

  /**
   * @route POST /api/sellers/
   * @description Creates a new seller profile.
   * @middleware validateDto(SellerDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/", validateDto(SellerDTO), (req, res) =>
    controller.createSeller(req, res)
  );

  /**
   * @route GET /api/sellers/
   * @description Retrieves a list of all sellers.
   * @access Public
   */
  router.get("/", (req, res) => controller.getAllSellers(req, res));

  /**
   * @route GET /api/sellers/:id
   * @description Retrieves a single seller by their unique ID.
   * @access Public
   */
  router.get("/:id", (req, res) => controller.getSellerById(req, res));

  /**
   * @route GET /api/sellers/user/:userId
   * @description Retrieves a seller profile by the associated user's ID.
   * @access Public
   */
  router.get("/user/:userId", (req, res) =>
    controller.getSellerByUserId(req, res)
  );

  /**
   * @route PUT /api/sellers/:id
   * @description Updates a seller's profile information.
   * @middleware validateDto(UpdateSellerDTO) - Validates the request body.
   * @access Private (Seller can update their own profile, or Admin can update any)
   */
  router.put("/:id", validateDto(UpdateSellerDTO), (req, res) =>
    controller.updateSeller(req, res)
  );

  /**
   * @route PUT /api/sellers/rating/:id
   * @description Triggers a recalculation of the seller's average rating and review count.
   * @access Private (Typically called internally by the review service)
   */
  router.put("/rating/:id", (req, res) =>
    controller.updateRatingAndReviewCount(req, res)
  );

  /**
   * @route DELETE /api/sellers/:id
   * @description Deletes a seller by their unique ID.
   * @access Private (Typically restricted to Admins)
   */
  router.delete("/:id", (req, res) => controller.deleteSeller(req, res));

  return router;
};
