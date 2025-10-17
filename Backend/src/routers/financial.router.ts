import { Router } from "express";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import {
  FinancialInstitutionDTO,
  FinancialProductDTO,
  FinancingApplicationDTO,
  UpdateFinancingApplicationDTO,
} from "../dtos/financial.DTO";
import { IFinancialController } from "../controllers/financial.controller";
import "../di/financial.di";
import { upload } from "../utils/fileHandel";

/**
 * Factory function that creates and configures the router for financial services endpoints.
 * It resolves the financial controller from the dependency injection container and maps
 * controller methods to specific API routes for institutions, products, and applications.
 *
 * @returns The configured Express Router for financial services.
 */
export const financialRouter = (): Router => {
  const router = Router();
  // Resolve the financial controller from the DI container.
  const controller = container.resolve<IFinancialController>(
    "FinancialController"
  );

  // --- Financial Institution Routes ---

  /**
   * @route POST /api/financials/institutions
   * @description Creates a new financial institution.
   * @middleware validateDto(FinancialInstitutionDTO) - Validates the request body.
   * @access Private (e.g., Admin)
   */
  router.post(
    "/institutions",
    validateDto(FinancialInstitutionDTO),
    (req, res) => controller.createInstitution(req, res)
  );

  /**
   * @route GET /api/financials/institutions
   * @description Retrieves a list of all financial institutions.
   * @access Public
   */
  router.get("/institutions", (req, res) =>
    controller.getAllInstitutions(req, res)
  );

  /**
   * @route GET /api/financials/institutions/:id
   * @description Retrieves a single financial institution by its unique ID.
   * @access Public
   */
  router.get("/institutions/:id", (req, res) =>
    controller.getInstitution(req, res)
  );

  /**
   * @route PUT /api/financials/institutions/:id
   * @description Updates an existing financial institution.
   * @middleware validateDto(FinancialInstitutionDTO) - Validates the request body.
   * @access Private (e.g., Finance role, Admin)
   */
  router.put(
    "/institutions/:id",
    validateDto(FinancialInstitutionDTO),
    (req, res) => controller.updateInstitution(req, res)
  );

  /**
   * @route DELETE /api/financials/institutions/:id
   * @description Deletes a financial institution by its unique ID.
   * @access Private (e.g., Admin)
   */
  router.delete("/institutions/:id", (req, res) =>
    controller.deleteInstitution(req, res)
  );

  // --- Financial Product Routes ---

  /**
   * @route POST /api/financials/products
   * @description Creates a new financial product.
   * @middleware validateDto(FinancialProductDTO) - Validates the request body.
   * @access Private (e.g., Finance role, Admin)
   */
  router.post("/products", validateDto(FinancialProductDTO), (req, res) =>
    controller.createProduct(req, res)
  );

  /**
   * @route GET /api/financials/products
   * @description Retrieves a list of all financial products. Can be filtered by `activeOnly` query param.
   * @access Public
   */
  router.get("/products", (req, res) => controller.getAllProducts(req, res));

  /**
   * @route GET /api/financials/products/institution/:institutionId
   * @description Retrieves all products for a specific institution.
   * @access Public
   */
  router.get("/products/institution/:institutionId", (req, res) =>
    controller.getProductsByInstitution(req, res)
  );

  /**
   * @route GET /api/financials/products/:id
   * @description Retrieves a single financial product by its unique ID.
   * @access Public
   */
  router.get("/products/:id", (req, res) => controller.getProduct(req, res));

  /**
   * @route PUT /api/financials/products/:id
   * @description Updates an existing financial product.
   * @middleware validateDto(FinancialProductDTO) - Validates the request body.
   * @access Private (e.g., Finance role, Admin)
   */
  router.put("/products/:id", validateDto(FinancialProductDTO), (req, res) =>
    controller.updateProduct(req, res)
  );

  /**
   * @route DELETE /api/financials/products/:id
   * @description Deletes a financial product by its unique ID.
   * @access Private (e.g., Finance role, Admin)
   */
  router.delete("/products/:id", (req, res) =>
    controller.deleteProduct(req, res)
  );

  // --- Financing Application Routes ---

  /**
   * @route POST /api/financials/applications
   * @description Creates a new financing application.
   * @middleware upload.array("files", 2) - Handles up to 2 file uploads with the field name 'files'.
   * @middleware validateDto(FinancingApplicationDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post(
    "/applications",
    upload.array("files", 2),
    validateDto(FinancingApplicationDTO),
    (req, res) => controller.createApplication(req, res)
  );

  /**
   * @route GET /api/financials/applications/user/:userId
   * @description Retrieves all financing applications for a specific user.
   * @access Private (User can get their own applications, or Admin)
   */
  router.get("/applications/user/:userId", (req, res) =>
    controller.getApplicationsByUser(req, res)
  );

  /**
   * @route GET /api/financials/applications/product/:productId
   * @description Retrieves all financing applications for a specific product.
   * @access Private (e.g., Finance role, Admin)
   */
  router.get("/applications/product/:productId", (req, res) =>
    controller.getApplicationsByProduct(req, res)
  );

  /**
   * @route GET /api/financials/applications/:id
   * @description Retrieves a single financing application by its unique ID.
   * @access Private (User who submitted, Finance role, or Admin)
   */
  router.get("/applications/:id", (req, res) =>
    controller.getApplication(req, res)
  );

  /**
   * @route PUT /api/financials/applications/:id
   * @description Updates an existing financing application.
   * @middleware upload.array("files", 2) - Handles up to 2 file uploads.
   * @middleware validateDto(FinancingApplicationDTO) - Validates the request body.
   * @access Private (User who submitted, or Admin)
   */
  router.put(
    "/applications/:id",
    upload.array("files", 2),
    validateDto(FinancingApplicationDTO),
    (req, res) => controller.updateApplication(req, res)
  ),
    /**
     * @route PATCH /api/financials/applications/:id/status
     * @description Updates the status of a financing application (e.g., approve, reject).
     * @middleware validateDto(UpdateFinancingApplicationDTO) - Validates the request body.
     * @access Private (e.g., Finance role, Admin)
     */
    router.patch(
      "/applications/:id/status",
      validateDto(UpdateFinancingApplicationDTO),
      (req, res) => controller.updateApplicationStatus(req, res)
    );

  /**
   * @route DELETE /api/financials/applications/:id
   * @description Deletes a financing application by its unique ID.
   * @access Private (User who submitted, or Admin)
   */
  router.delete("/applications/:id", (req, res) =>
    controller.deleteApplication(req, res)
  );

  return router;
};
