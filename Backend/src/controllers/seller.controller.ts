import { Request, Response } from "express";
import { ISellerService } from "../services/seller.service";
import { handleResult, handleError } from "../utils/Respons.util";

export interface ISellerController {
  createSeller(req: Request, res: Response): Promise<Response>;
  getSellerById(req: Request, res: Response): Promise<Response>;
  getSellerByUserId(req: Request, res: Response): Promise<Response>;
  getAllSellers(req: Request, res: Response): Promise<Response>;
  updateSeller(req: Request, res: Response): Promise<Response>;
  updateRatingAndReviewCount(
    req: Request,
    res: Response
  ): Promise<Response>;
  deleteSeller(req: Request, res: Response): Promise<Response>;
}

export function sellerController(service: ISellerService): ISellerController {

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
    updateRatingAndReviewCount: async (req, res) => {
      try {
        const result = await service.updateRatingAndReviewCount(
          req.params.id,
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateRatingAndReviewCount");
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
