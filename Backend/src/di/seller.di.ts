import { container } from "tsyringe";
import {
  ISellerRepository,
  SellerRepository,
} from "../repositories/seller.repository";
import { ISellerService, sellerService } from "../services/seller.service";
import {
  ISellerController,
  sellerController,
} from "../controllers/seller.controller";

container.register<ISellerRepository>("SellerRepository", {
  useValue: SellerRepository,
});
container.register<ISellerService>("SellerService", {
  useFactory: (c) => sellerService(c.resolve<ISellerRepository>("SellerRepository")),
});
container.register<ISellerController>("SellerController", {
  useFactory: (c) => sellerController(c.resolve<ISellerService>("SellerService")),
});
