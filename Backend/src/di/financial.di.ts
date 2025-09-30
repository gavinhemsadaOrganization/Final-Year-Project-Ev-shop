import { container } from "tsyringe";
import {
  IFinancialRepository,
  FinancialRepository,
} from "../repositories/financial.repository";
import {
  IFinancialService,
  financialService,
} from "../services/financial.service";
import {
  IFinancialController,
  financialController,
} from "../controllers/financial.controller";

container.register<IFinancialRepository>("FinancialRepository", {
  useValue: FinancialRepository,
});

container.register<IFinancialService>("FinancialService", {
  useFactory: (c) => financialService(c.resolve<IFinancialRepository>("FinancialRepository")),
});

container.register<IFinancialController>("FinancialController", {
  useFactory: (c) => financialController(c.resolve<IFinancialService>("FinancialService")),
});
