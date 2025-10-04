import { container } from "tsyringe";
import { IEvRepository, EvRepository } from "../repositories/ev.repository";
import { IEvService, evService } from "../services/ev.service";
import { IEvController, evController } from "../controllers/ev.controller";
import { ISellerRepository } from "../repositories/seller.repository";

container.register<IEvRepository>("EvRepository", { useValue: EvRepository });

container.register<IEvService>("EvService", {
  useFactory: (c) => evService(
    c.resolve<IEvRepository>("EvRepository"),
    c.resolve<ISellerRepository>("SellerRepository")
  ),
});

container.register<IEvController>("EvController", {
  useFactory: (c) => evController(c.resolve<IEvService>("EvService")),
});
