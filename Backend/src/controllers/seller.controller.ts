import { Request, Response } from "express";
import { ISellerService } from "../services/seller.service";
import logger from "../utils/logger";

export interface ISellerController {
  createSeller(req: Request, res: Response): Promise<Response>;
  getSellerById(req: Request, res: Response): Promise<Response>;
  getSellerByUserId(req: Request, res: Response): Promise<Response>;
  getAllSellers(req: Request, res: Response): Promise<Response>;
  updateSeller(req: Request, res: Response): Promise<Response>;
  deleteSeller(req: Request, res: Response): Promise<Response>;
}

export function sellerController(service: ISellerService): ISellerController {
  const handleResult = (
    res: Response,
    result: { success: boolean; [key: string]: any; error?: string },
    successStatus: number = 200
  ) => {
    if (!result.success) {
      const statusCode = result.error?.includes("not found") ? 404 : 400;
      logger.warn(result.error);
      return res.status(statusCode).json({ message: result.error });
    }
    const dataKey = Object.keys(result).find(
      (k) => k !== "success" && k !== "error"
    );
    logger.info(`Operation successful. Data key: ${dataKey}`);
    return res
      .status(successStatus)
      .json(dataKey ? result[dataKey] : { message: "Operation successful" });
  };

  const handleError = (res: Response, error: unknown, operation: string) => {
    logger.error(`Error during ${operation}: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  };

  return {
    createSeller: async (req, res) => {
      try {
        const result = await service.createSeller(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createSeller");
      }
    },

    getSellerById: async (req, res) => {
      try {
        const result = await service.getSellerById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getSellerById");
      }
    },

    getSellerByUserId: async (req, res) => {
      try {
        const result = await service.getSellerByUserId(req.params.userId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getSellerByUserId");
      }
    },

    getAllSellers: async (_req, res) => {
      try {
        const result = await service.getAllSellers();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllSellers");
      }
    },

    updateSeller: async (req, res) => {
      try {
        const result = await service.updateSeller(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateSeller");
      }
    },

    deleteSeller: async (req, res) => {
      try {
        const result = await service.deleteSeller(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteSeller");
      }
    },
  };
}
