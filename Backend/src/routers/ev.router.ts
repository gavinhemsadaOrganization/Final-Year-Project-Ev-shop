import { Router } from "express";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import {
  EvBrandDTO,
  EvCategoryDTO,
  EvModelDTO,
  VehicleListingDTO,
  UpdateVehicleListingDTO,
} from "../dtos/ev.DTO";
import { IEvController } from "../controllers/ev.controller";
import "../di/ev.di";
import { upload } from "../utils/fileHandel";

export const evRouter = (): Router => {
  const router = Router();
  const controller = container.resolve<IEvController>("EvController");
  // brand
  router.post("/brands", upload.single("brand_logo"), validateDto(EvBrandDTO), (req, res) =>
    controller.createBrand(req, res)
  );
  router.get("/brands", (req, res) => controller.getAllBrands(req, res));
  router.get("/brands/:id", (req, res) => controller.getById(req, res));
  router.put("/brands/:id", upload.single("brand_logo"), validateDto(EvBrandDTO), (req, res) =>
    controller.updateBrand(req, res)
  );
  router.delete("/brands/:id", (req, res) => controller.deleteBrand(req, res));

  // category
  router.post("/categories", validateDto(EvCategoryDTO), (req, res) =>
    controller.createCategory(req, res)
  );
  router.get("/categories", (req, res) =>
    controller.getAllCategories(req, res)
  );
  router.get("/categories/:id", (req, res) =>
    controller.getCategoryByid(req, res)
  );
  router.put("/categories/:id", validateDto(EvCategoryDTO), (req, res) =>
    controller.updateCategory(req, res)
  );
  router.delete("/categories/:id", (req, res) =>
    controller.deleteCategory(req, res)
  );

  // model
  router.post("/models", upload.array("images", 5), validateDto(EvModelDTO), (req, res) =>
    controller.createModel(req, res)
  );
  router.get("/models", (req, res) => controller.getAllModels(req, res));
  router.get("/models/:id", (req, res) => controller.getModelById(req, res));
  router.put("/models/:id", upload.array("images", 5), validateDto(EvModelDTO), (req, res) =>
    controller.updateModel(req, res)
  );
  router.delete("/models/:id", (req, res) => controller.deleteModel(req, res));

 // listings
  router.post("/listings", upload.array("images", 5), validateDto(VehicleListingDTO), (req, res) =>
    controller.createListing(req, res)
  );
  router.get("/listings", (req, res) => controller.getAllListings(req, res));
  router.get("/listings/seller/:sellerId", (req, res) =>
    controller.getListingsBySeller(req, res)
  );
  router.get("/listings/:id", (req, res) =>
    controller.getListingById(req, res)
  );
  router.put(
    "/listings/:id",
    upload.array("images", 5),
    validateDto(UpdateVehicleListingDTO),
    (req, res) => controller.updateListing(req, res)
  );
  router.delete("/listings/:id", (req, res) =>
    controller.deleteListing(req, res)
  );

  return router;
};
