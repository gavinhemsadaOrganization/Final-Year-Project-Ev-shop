import { Router } from "express";
import { container } from "../di/seller.di";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import { SellerDTO, UpdateSellerDTO } from "../dtos/seller.DTO";
import { ISellerController } from "../controllers/seller.controller";

export const sellerRouter = (): Router => {
  const router = Router();
  const controller = container.resolve<ISellerController>("ISellerController");

  router.post("/", validateDto(SellerDTO), (req, res) =>
    controller.createSeller(req, res)
  );
  router.get("/", (req, res) => controller.getAllSellers(req, res));
  router.get("/:id", (req, res) => controller.getSellerById(req, res));
  router.get("/user/:userId", (req, res) =>
    controller.getSellerByUserId(req, res)
  );
  router.put("/:id", validateDto(UpdateSellerDTO), (req, res) =>
    controller.updateSeller(req, res)
  );
  router.put("/rating/:id", (req, res) =>
    controller.updateRatingAndReviewCount(req, res)
  );
  router.delete("/:id", (req, res) => controller.deleteSeller(req, res));

  return router;
};
