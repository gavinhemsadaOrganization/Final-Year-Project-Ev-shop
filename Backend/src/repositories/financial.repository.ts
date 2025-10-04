import { Types } from "mongoose";
import {
  FinancialInstitution,
  IFinancialInstitution,
} from "../models/FinancialInstitution";
import {
  FinancialProduct,
  IFinancialProduct,
} from "../models/FinancialProduct";
import {
  FinancingApplication,
  IFinancingApplication,
} from "../models/FinancingApplication";
import {
  FinancialInstitutionDTO,
  FinancialProductDTO,
  FinancingApplicationDTO,
  UpdateFinancingApplicationDTO,
} from "../dtos/financial.DTO";
import { ApplicationStatus } from "../enum/enum";

export interface IFinancialRepository {
  // Institution Methods
  createInstitution(
    data: FinancialInstitutionDTO
  ): Promise<IFinancialInstitution>;
  findInstitutionById(id: string): Promise<IFinancialInstitution | null>;
  findInstitutionByUserId(id: string): Promise<IFinancialInstitution | null>;
  findAllInstitutions(): Promise<IFinancialInstitution[]>;
  updateInstitution(
    id: string,
    data: Partial<FinancialInstitutionDTO>
  ): Promise<IFinancialInstitution | null>;
  deleteInstitution(id: string): Promise<boolean>;

  // Product Methods
  createProduct(data: FinancialProductDTO): Promise<IFinancialProduct>;
  findProductById(id: string): Promise<IFinancialProduct | null>;
  findAllProducts(activeOnly?: boolean): Promise<IFinancialProduct[]>;
  findProductsByInstitution(
    institutionId: string
  ): Promise<IFinancialProduct[]>;
  updateProduct(
    id: string,
    data: Partial<FinancialProductDTO>
  ): Promise<IFinancialProduct | null>;
  deleteProduct(id: string): Promise<boolean>;

  // Application Methods
  createApplication(
    data: FinancingApplicationDTO
  ): Promise<IFinancingApplication>;
  findApplicationById(id: string): Promise<IFinancingApplication | null>;
  findApplicationsByUserId(userId: string): Promise<IFinancingApplication[]>;
  findApplicationsByProductId(
    productId: string
  ): Promise<IFinancingApplication[]>;
  updateApplication(
    id: string,
    data: Partial<UpdateFinancingApplicationDTO | FinancingApplicationDTO>
  ): Promise<IFinancingApplication | null>;
  deleteApplication(id: string): Promise<boolean>;
  checkApplictionStatesbyUserID(id: string): Promise<boolean>;
}

export const FinancialRepository: IFinancialRepository = {
  // Institution Methods
  createInstitution: async (data) => {
    const institution = new FinancialInstitution(data);
    return await institution.save();
  },
  findInstitutionById: async (id) => FinancialInstitution.findById(id),
  findAllInstitutions: async () => FinancialInstitution.find(),
  findInstitutionByUserId: async (id) =>
    FinancialInstitution.findOne({ user_id: new Types.ObjectId(id) }),
  updateInstitution: async (id, data) =>
    FinancialInstitution.findByIdAndUpdate(id, data, { new: true }),
  deleteInstitution: async (id) => {
    const result = await FinancialInstitution.findByIdAndDelete(id);
    return result !== null;
  },

  // Product Methods
  createProduct: async (data) => {
    const product = new FinancialProduct(data);
    return await product.save();
  },
  findProductById: async (id) => FinancialProduct.findById(id),
  findAllProducts: async (activeOnly = true) => {
    const filter = activeOnly ? { is_active: true } : {};
    return FinancialProduct.find(filter).populate("institution_id");
  },
  findProductsByInstitution: async (institutionId) =>
    FinancialProduct.find({
      institution_id: new Types.ObjectId(institutionId),
    }),
  updateProduct: async (id, data) =>
    FinancialProduct.findByIdAndUpdate(id, data, { new: true }),
  deleteProduct: async (id) => {
    const result = await FinancialProduct.findByIdAndDelete(id);
    return result !== null;
  },

  // Application Methods
  createApplication: async (data) => {
    const application = new FinancingApplication(data);
    return await application.save();
  },
  findApplicationById: async (id) =>
    FinancingApplication.findById(id)
      .populate("user_id", "name email")
      .populate({
        path: "product_id",
        populate: { path: "institution_id", select: "name" },
      }),
  findApplicationsByUserId: async (userId) =>
    FinancingApplication.find({ user_id: new Types.ObjectId(userId) })
      .populate({
        path: "product_id",
        populate: { path: "institution_id", select: "name" },
      })
      .sort({ createdAt: -1 }),
  findApplicationsByProductId: async (productId) =>
    FinancingApplication.find({ product_id: new Types.ObjectId(productId) })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 }),
  updateApplication: async (id, data) =>
    FinancingApplication.findByIdAndUpdate(id, data, { new: true }),
  deleteApplication: async (id) => {
    const result = await FinancingApplication.findByIdAndDelete(id);
    return result !== null;
  },
  checkApplictionStatesbyUserID: async (id) => {
    const result = await FinancingApplication.find({
      user_id: new Types.ObjectId(id),
    });

    if (result.length === 0) {
      return true; 
    }

    const hasBlockedStatus = result.some(
      (element) =>
        element.status === ApplicationStatus.PENDING ||
        element.status === ApplicationStatus.APPROVED ||
        element.status === ApplicationStatus.UNDER_REVIEW
    );

    return !hasBlockedStatus;
  },
};
