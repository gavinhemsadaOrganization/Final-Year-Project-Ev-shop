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
import { withErrorHandling } from "../utils/CustomException";

export interface IFinancialRepository {
  // Institution Methods
  createInstitution(
    data: FinancialInstitutionDTO
  ): Promise<IFinancialInstitution | null>;
  findInstitutionById(id: string): Promise<IFinancialInstitution | null>;
  findInstitutionByUserId(id: string): Promise<IFinancialInstitution | null>;
  findAllInstitutions(): Promise<IFinancialInstitution[] | null>;
  updateInstitution(
    id: string,
    data: Partial<FinancialInstitutionDTO>
  ): Promise<IFinancialInstitution | null>;
  deleteInstitution(id: string): Promise<boolean | null>;

  // Product Methods
  createProduct(data: FinancialProductDTO): Promise<IFinancialProduct | null>;
  findProductById(id: string): Promise<IFinancialProduct | null>;
  findAllProducts(activeOnly?: boolean): Promise<IFinancialProduct[] | null>;
  findProductsByInstitution(
    institutionId: string
  ): Promise<IFinancialProduct[] | null>;
  updateProduct(
    id: string,
    data: Partial<FinancialProductDTO>
  ): Promise<IFinancialProduct | null>;
  deleteProduct(id: string): Promise<boolean | null>;

  // Application Methods
  createApplication(
    data: FinancingApplicationDTO
  ): Promise<IFinancingApplication | null>;
  findApplicationById(id: string): Promise<IFinancingApplication | null>;
  findApplicationsByUserId(
    userId: string
  ): Promise<IFinancingApplication[] | null>;
  findApplicationsByProductId(
    productId: string
  ): Promise<IFinancingApplication[] | null>;
  updateApplication(
    id: string,
    data: Partial<UpdateFinancingApplicationDTO | FinancingApplicationDTO>
  ): Promise<IFinancingApplication | null>;
  deleteApplication(id: string): Promise<boolean | null>;
  checkApplictionStatesbyUserID(id: string): Promise<boolean | null>;
}

export const FinancialRepository: IFinancialRepository = {
  // Institution Methods
  createInstitution: withErrorHandling(async (data) => {
    const institution = new FinancialInstitution(data);
    return await institution.save();
  }),
  findInstitutionById: withErrorHandling(async (id) =>
    FinancialInstitution.findById(id)
  ),
  findAllInstitutions: withErrorHandling(async () =>
    FinancialInstitution.find()
  ),
  findInstitutionByUserId: withErrorHandling(async (id) =>
    FinancialInstitution.findOne({ user_id: new Types.ObjectId(id) })
  ),
  updateInstitution: withErrorHandling(async (id, data) =>
    FinancialInstitution.findByIdAndUpdate(id, data, { new: true })
  ),
  deleteInstitution: withErrorHandling(async (id) => {
    const result = await FinancialInstitution.findByIdAndDelete(id);
    return result !== null;
  }),

  // Product Methods
  createProduct: withErrorHandling(async (data) => {
    const product = new FinancialProduct(data);
    return await product.save();
  }),
  findProductById: withErrorHandling(async (id) =>
    FinancialProduct.findById(id)
  ),
  findAllProducts: withErrorHandling(async (activeOnly = true) => {
    const filter = activeOnly ? { is_active: true } : {};
    return FinancialProduct.find(filter).populate("institution_id");
  }),
  findProductsByInstitution: withErrorHandling(async (institutionId) =>
    FinancialProduct.find({
      institution_id: new Types.ObjectId(institutionId),
    })
  ),
  updateProduct: withErrorHandling(async (id, data) =>
    FinancialProduct.findByIdAndUpdate(id, data, { new: true })
  ),
  deleteProduct: withErrorHandling(async (id) => {
    const result = await FinancialProduct.findByIdAndDelete(id);
    return result !== null;
  }),

  // Application Methods
  createApplication: withErrorHandling(async (data) => {
    const application = new FinancingApplication(data);
    return await application.save();
  }),
  findApplicationById: withErrorHandling(async (id) =>
    FinancingApplication.findById(id)
      .populate("user_id", "name email")
      .populate({
        path: "product_id",
        populate: { path: "institution_id", select: "name" },
      })
  ),
  findApplicationsByUserId: withErrorHandling(async (userId) =>
    FinancingApplication.find({ user_id: new Types.ObjectId(userId) })
      .populate({
        path: "product_id",
        populate: { path: "institution_id", select: "name" },
      })
      .sort({ createdAt: -1 })
  ),
  findApplicationsByProductId: withErrorHandling(async (productId) =>
    FinancingApplication.find({ product_id: new Types.ObjectId(productId) })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 })
  ),
  updateApplication: withErrorHandling(async (id, data) =>
    FinancingApplication.findByIdAndUpdate(id, data, { new: true })
  ),
  deleteApplication: withErrorHandling(async (id) => {
    const result = await FinancingApplication.findByIdAndDelete(id);
    return result !== null;
  }),
  checkApplictionStatesbyUserID: withErrorHandling(async (id) => {
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
  }),
};
