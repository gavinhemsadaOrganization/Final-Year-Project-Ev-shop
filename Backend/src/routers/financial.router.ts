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

export const financialRouter = (): Router => {
  const router = Router();
  const controller = container.resolve<IFinancialController>(
    "FinancialController"
  );
  // FinancialInstitution
  router.post(
    "/institutions",
    validateDto(FinancialInstitutionDTO),
    (req, res) => controller.createInstitution(req, res)
  );
 
  router.get("/institutions", (req, res) =>
    controller.getAllInstitutions(req, res)
  );

  router.get("/institutions/:id", (req, res) =>
    controller.getInstitution(req, res)
  );
 
  router.put(
    "/institutions/:id",
    validateDto(FinancialInstitutionDTO),
    (req, res) => controller.updateInstitution(req, res)
  );
  
  router.delete("/institutions/:id", (req, res) =>
    controller.deleteInstitution(req, res)
  );

  // FinancialProduct
  router.post("/products", validateDto(FinancialProductDTO), (req, res) =>
    controller.createProduct(req, res)
  );
  
  router.get("/products", (req, res) => controller.getAllProducts(req, res));
  
  router.get("/products/institution/:institutionId", (req, res) =>
    controller.getProductsByInstitution(req, res)
  );
  
  router.get("/products/:id", (req, res) => controller.getProduct(req, res));
  
  router.put("/products/:id", validateDto(FinancialProductDTO), (req, res) =>
    controller.updateProduct(req, res)
  );
  
  router.delete("/products/:id", (req, res) =>
    controller.deleteProduct(req, res)
  );
  
  // FinancingApplication
  router.post(
    "/applications",
    upload.array("files",2),
    validateDto(FinancingApplicationDTO),
    (req, res) => controller.createApplication(req, res)
  );
 
  router.get("/applications/user/:userId", (req, res) =>
    controller.getApplicationsByUser(req, res)
  );

  router.get("/applications/product/:productId", (req, res) =>
    controller.getApplicationsByProduct(req, res)
  );
  
  router.get("/applications/:id", (req, res) =>
    controller.getApplication(req, res)
  );
  
  router.patch(
    "/applications/:id/status",
    validateDto(UpdateFinancingApplicationDTO),
    (req, res) => controller.updateApplicationStatus(req, res)
  );
  
  router.delete("/applications/:id", (req, res) =>
    controller.deleteApplication(req, res)
  );

  return router;
};
