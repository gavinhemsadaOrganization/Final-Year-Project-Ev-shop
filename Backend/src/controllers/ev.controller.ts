import { Request, Response } from "express";
import { IEvService } from "../services/ev.service";
import { handleResult, handleError } from "../utils/Respons.util";

export interface IEvController {
  // Brand
  createBrand(req: Request, res: Response): Promise<Response>;
  getAllBrands(req: Request, res: Response): Promise<Response>;

  // Category
  createCategory(req: Request, res: Response): Promise<Response>;
  getAllCategories(req: Request, res: Response): Promise<Response>;

  // Model
  createModel(req: Request, res: Response): Promise<Response>;
  getAllModels(req: Request, res: Response): Promise<Response>;
  getModelById(req: Request, res: Response): Promise<Response>;

  // Listing
  createListing(req: Request, res: Response): Promise<Response>;
  getAllListings(req: Request, res: Response): Promise<Response>;
  getListingById(req: Request, res: Response): Promise<Response>;
  getListingsBySeller(req: Request, res: Response): Promise<Response>;
  updateListing(req: Request, res: Response): Promise<Response>;
  deleteListing(req: Request, res: Response): Promise<Response>;
}

export function evController(service: IEvService): IEvController {
  return {
    // Brand
    createBrand: async (req, res) => {
      try {
        const r = await service.createBrand(req.body);
        return handleResult(res, r, 201);
      } catch (e) {
        return handleError(res, e, "createBrand");
      }
    },
    getAllBrands: async (req, res) => {
      try {
        const r = await service.getAllBrands();
        return handleResult(res, r);
      } catch (e) {
        return handleError(res, e, "getAllBrands");
      }
    },

    // Category
    createCategory: async (req, res) => {
      try {
        const r = await service.createCategory(req.body);
        return handleResult(res, r, 201);
      } catch (e) {
        return handleError(res, e, "createCategory");
      }
    },
    getAllCategories: async (req, res) => {
      try {
        const r = await service.getAllCategories();
        return handleResult(res, r);
      } catch (e) {
        return handleError(res, e, "getAllCategories");
      }
    },

    // Model
    createModel: async (req, res) => {
      try {
        const r = await service.createModel(req.body);
        return handleResult(res, r, 201);
      } catch (e) {
        return handleError(res, e, "createModel");
      }
    },
    getAllModels: async (req, res) => {
      try {
        const r = await service.getAllModels();
        return handleResult(res, r);
      } catch (e) {
        return handleError(res, e, "getAllModels");
      }
    },
    getModelById: async (req, res) => {
      try {
        const r = await service.getModelById(req.params.id);
        return handleResult(res, r);
      } catch (e) {
        return handleError(res, e, "getModelById");
      }
    },

    // Listing
    createListing: async (req, res) => {
      try {
        const result = await service.createListing(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createListing");
      }
    },
    getAllListings: async (req, res) => {
      try {
        // Pass query params as filters
        const result = await service.getAllListings(req.query);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllListings");
      }
    },
    getListingById: async (req, res) => {
      try {
        const result = await service.getListingById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getListingById");
      }
    },
    getListingsBySeller: async (req, res) => {
      try {
        const result = await service.getListingsBySeller(req.params.sellerId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getListingsBySeller");
      }
    },
    updateListing: async (req, res) => {
      try {
        const result = await service.updateListing(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateListing");
      }
    },
    deleteListing: async (req, res) => {
      try {
        const result = await service.deleteListing(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteListing");
      }
    },
  };
}
