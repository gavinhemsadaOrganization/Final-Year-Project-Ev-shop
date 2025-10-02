import { Request, Response } from "express";
import { IFinancialService } from "../services/financial.service";
import { handleResult, handleError } from "../utils/Respons.util";

export interface IFinancialController {
  // Institution
  createInstitution(req: Request, res: Response): Promise<Response>;
  getInstitution(req: Request, res: Response): Promise<Response>;
  getAllInstitutions(req: Request, res: Response): Promise<Response>;
  updateInstitution(req: Request, res: Response): Promise<Response>;
  deleteInstitution(req: Request, res: Response): Promise<Response>;

  // Product
  createProduct(req: Request, res: Response): Promise<Response>;
  getProduct(req: Request, res: Response): Promise<Response>;
  getAllProducts(req: Request, res: Response): Promise<Response>;
  getProductsByInstitution(req: Request, res: Response): Promise<Response>;
  updateProduct(req: Request, res: Response): Promise<Response>;
  deleteProduct(req: Request, res: Response): Promise<Response>;

  // Application
  createApplication(req: Request, res: Response): Promise<Response>;
  getApplication(req: Request, res: Response): Promise<Response>;
  getApplicationsByUser(req: Request, res: Response): Promise<Response>;
  getApplicationsByProduct(req: Request, res: Response): Promise<Response>;
  updateApplicationStatus(req: Request, res: Response): Promise<Response>;
  deleteApplication(req: Request, res: Response): Promise<Response>;
}

export function financialController(
  service: IFinancialService
): IFinancialController {
  return {
    // Institution
    createInstitution: async (req, res) => {
      try {
        const result = await service.createInstitution(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createInstitution");
      }
    },
    getInstitution: async (req, res) => {
      try {
        const result = await service.getInstitutionById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getInstitution");
      }
    },
    getAllInstitutions: async (_req, res) => {
      try {
        const result = await service.getAllInstitutions();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllInstitutions");
      }
    },
    updateInstitution: async (req, res) => {
      try {
        const result = await service.updateInstitution(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateInstitution");
      }
    },
    deleteInstitution: async (req, res) => {
      try {
        const result = await service.deleteInstitution(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteInstitution");
      }
    },

    // Product
    createProduct: async (req, res) => {
      try {
        const result = await service.createProduct(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createProduct");
      }
    },
    getProduct: async (req, res) => {
      try {
        const result = await service.getProductById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getProduct");
      }
    },
    getAllProducts: async (req, res) => {
      try {
        const activeOnly = req.query.activeOnly !== "false";
        const result = await service.getAllProducts(activeOnly);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllProducts");
      }
    },
    getProductsByInstitution: async (req, res) => {
      try {
        const result = await service.getProductsByInstitution(
          req.params.institutionId
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getProductsByInstitution");
      }
    },
    updateProduct: async (req, res) => {
      try {
        const result = await service.updateProduct(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateProduct");
      }
    },
    deleteProduct: async (req, res) => {
      try {
        const result = await service.deleteProduct(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteProduct");
      }
    },

    // Application
    createApplication: async (req, res) => {
      try {
        const result = await service.createApplication(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createApplication");
      }
    },
    getApplication: async (req, res) => {
      try {
        const result = await service.getApplicationById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getApplication");
      }
    },
    getApplicationsByUser: async (req, res) => {
      try {
        const result = await service.getApplicationsByUser(req.params.userId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getApplicationsByUser");
      }
    },
    getApplicationsByProduct: async (req, res) => {
      try {
        const result = await service.getApplicationsByProduct(
          req.params.productId
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getApplicationsByProduct");
      }
    },
    updateApplicationStatus: async (req, res) => {
      try {
        const result = await service.updateApplicationStatus(
          req.params.id,
          req.body
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateApplicationStatus");
      }
    },
    deleteApplication: async (req, res) => {
      try {
        const result = await service.deleteApplication(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteApplication");
      }
    },
  };
}
