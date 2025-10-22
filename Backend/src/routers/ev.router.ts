import { Router } from "express";
import { validateDto } from "../shared/middlewares/DtoValidator.middleware";
import {
  EvBrandDTO,
  EvCategoryDTO,
  EvModelDTO,
  VehicleListingDTO,
  UpdateVehicleListingDTO,
} from "../dtos/ev.DTO";
import { IEvController } from "../controllers/ev.controller";
import { container } from "../di/container";
import { upload } from "../shared/utils/imageHandel";

/**
 * Factory function that creates and configures the router for EV-related endpoints.
 * It resolves the EV controller from the dependency injection container and maps
 * controller methods to specific API routes for brands, categories, models, and listings.
 *
 * @returns The configured Express Router for the EV catalog.
 */
export const evRouter = (): Router => {
  const router = Router();
  // Resolve the EV controller from the DI container.
  const controller = container.resolve<IEvController>("EvController");

  // --- Brand Routes ---

  /**
   * @route POST /api/ev/brands
   * @description Creates a new EV brand.
   * @middleware upload.single("brand_logo") - Handles a single file upload for the brand's logo.
   * @middleware validateDto(EvBrandDTO) - Validates the request body.
   * @access Private (e.g., Admin)
   */
  router.post(
    "/brands",
    upload.single("brand_logo"),
    validateDto(EvBrandDTO),
    (req, res) => controller.createBrand(req, res)
  );

  /**
   * @route GET /api/ev/brands
   * @description Retrieves a list of all EV brands.
   * @access Public
   */
  router.get("/brands", (req, res) => controller.getAllBrands(req, res));

  /**
   * @route GET /api/ev/brands/:id
   * @description Retrieves a single EV brand by its unique ID.
   * @access Public
   */
  router.get("/brands/:id", (req, res) => controller.getById(req, res));

  /**
   * @route PUT /api/ev/brands/:id
   * @description Updates an existing EV brand.
   * @middleware upload.single("brand_logo") - Handles an optional file upload for updating the brand's logo.
   * @middleware validateDto(EvBrandDTO) - Validates the request body.
   * @access Private (e.g., Admin)
   */
  router.put(
    "/brands/:id",
    upload.single("brand_logo"),
    validateDto(EvBrandDTO),
    (req, res) => controller.updateBrand(req, res)
  );

  /**
   * @route DELETE /api/ev/brands/:id
   * @description Deletes an EV brand by its unique ID.
   * @access Private (e.g., Admin)
   */
  router.delete("/brands/:id", (req, res) => controller.deleteBrand(req, res));

  // --- Category Routes ---

  /**
   * @route POST /api/ev/categories
   * @description Creates a new EV category.
   * @middleware validateDto(EvCategoryDTO) - Validates the request body.
   * @access Private (e.g., Admin)
   */
  router.post("/categories", validateDto(EvCategoryDTO), (req, res) =>
    controller.createCategory(req, res)
  );

  /**
   * @route GET /api/ev/categories
   * @description Retrieves a list of all EV categories.
   * @access Public
   */
  router.get("/categories", (req, res) =>
    controller.getAllCategories(req, res)
  );

  /**
   * @route GET /api/ev/categories/:id
   * @description Retrieves a single EV category by its unique ID.
   * @access Public
   */
  router.get("/categories/:id", (req, res) =>
    controller.getCategoryByid(req, res)
  );

  /**
   * @route PUT /api/ev/categories/:id
   * @description Updates an existing EV category.
   * @middleware validateDto(EvCategoryDTO) - Validates the request body.
   * @access Private (e.g., Admin)
   */
  router.put("/categories/:id", validateDto(EvCategoryDTO), (req, res) =>
    controller.updateCategory(req, res)
  );

  /**
   * @route DELETE /api/ev/categories/:id
   * @description Deletes an EV category by its unique ID.
   * @access Private (e.g., Admin)
   */
  router.delete("/categories/:id", (req, res) =>
    controller.deleteCategory(req, res)
  );

  // --- Model Routes ---

  /**
   * @route POST /api/ev/models
   * @description Creates a new EV model.
   * @middleware upload.array("images", 5) - Handles up to 5 file uploads for model images.
   * @middleware validateDto(EvModelDTO) - Validates the request body.
   * @access Private (e.g., Admin)
   */
  router.post(
    "/models",
    upload.array("images", 5),
    validateDto(EvModelDTO),
    (req, res) => controller.createModel(req, res)
  );

  /**
   * @route GET /api/ev/models
   * @description Retrieves a list of all EV models.
   * @access Public
   */
  router.get("/models", (req, res) => controller.getAllModels(req, res));

  /**
   * @route GET /api/ev/models/:id
   * @description Retrieves a single EV model by its unique ID.
   * @access Public
   */
  router.get("/models/:id", (req, res) => controller.getModelById(req, res));

  /**
   * @route PUT /api/ev/models/:id
   * @description Updates an existing EV model.
   * @middleware upload.array("images", 5) - Handles optional file uploads for updating model images.
   * @middleware validateDto(EvModelDTO) - Validates the request body.
   * @access Private (e.g., Admin)
   */
  router.put(
    "/models/:id",
    upload.array("images", 5),
    validateDto(EvModelDTO),
    (req, res) => controller.updateModel(req, res)
  );

  /**
   * @route DELETE /api/ev/models/:id
   * @description Deletes an EV model by its unique ID.
   * @access Private (e.g., Admin)
   */
  router.delete("/models/:id", (req, res) => controller.deleteModel(req, res));

  // --- Listing Routes ---

  /**
   * @route POST /api/ev/listings
   * @description Creates a new vehicle listing.
   * @middleware upload.array("images", 5) - Handles up to 5 file uploads for listing images.
   * @middleware validateDto(VehicleListingDTO) - Validates the request body.
   * @access Private (e.g., Seller, Admin)
   */
  router.post(
    "/listings",
    upload.array("images", 5),
    validateDto(VehicleListingDTO),
    (req, res) => controller.createListing(req, res)
  );

  /**
   * @route GET /api/ev/listings
   * @description Retrieves a list of all vehicle listings, with optional filtering via query parameters.
   * @access Public
   */
  router.get("/listings", (req, res) => controller.getAllListings(req, res));

  /**
   * @route GET /api/ev/listings/seller/:sellerId
   * @description Retrieves all listings for a specific seller.
   * @access Public
   */
  router.get("/listings/seller/:sellerId", (req, res) =>
    controller.getListingsBySeller(req, res)
  );

  /**
   * @route GET /api/ev/listings/:id
   * @description Retrieves a single vehicle listing by its unique ID.
   * @access Public
   */
  router.get("/listings/:id", (req, res) =>
    controller.getListingById(req, res)
  );

  /**
   * @route PUT /api/ev/listings/:id
   * @description Updates an existing vehicle listing.
   * @middleware upload.array("images", 5) - Handles optional file uploads for updating listing images.
   * @middleware validateDto(UpdateVehicleListingDTO) - Validates the request body.
   * @access Private (e.g., Seller, Admin)
   */
  router.put(
    "/listings/:id",
    upload.array("images", 5),
    validateDto(UpdateVehicleListingDTO),
    (req, res) => controller.updateListing(req, res)
  );

  /**
   * @route DELETE /api/ev/listings/:id
   * @description Deletes a vehicle listing by its unique ID.
   * @access Private (e.g., Seller, Admin)
   */
  router.delete("/listings/:id", (req, res) =>
    controller.deleteListing(req, res)
  );

  return router;
};
