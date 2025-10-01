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

container.register<ISellerRepository>("ISellerRepository", {
  useValue: SellerRepository,
});
container.register<ISellerService>("ISellerService", {
  useFactory: (c) => sellerService(c.resolve<ISellerRepository>("ISellerRepository")),
});
container.register<ISellerController>("ISellerController", {
  useFactory: (c) => sellerController(c.resolve<ISellerService>("ISellerService")),
});

export { container };
