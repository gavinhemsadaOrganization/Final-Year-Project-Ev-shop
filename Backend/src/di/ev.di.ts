import { container } from "tsyringe";
import { IEvRepository, EvRepository } from "../repositories/ev.repository";
import { IEvService, evService } from "../services/ev.service";
import { IEvController, evController } from "../controllers/ev.controller";

container.register<IEvRepository>("EvRepository", { useValue: EvRepository });

container.register<IEvService>("EvService", {
  useFactory: (c) => evService(c.resolve("EvRepository")),
});

container.register<IEvController>("EvController", {
  useFactory: (c) => evController(c.resolve("EvService")),
});
