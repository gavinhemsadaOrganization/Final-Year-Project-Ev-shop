import {
  FinancialInstitutionDTO,
  FinancialProductDTO,
  FinancingApplicationDTO,
  UpdateFinancingApplicationDTO,
} from "../dtos/financial.DTO";
import { ApplicationStatus } from "../enum/enum";
import { IFinancialRepository } from "../repositories/financial.repository";

export interface IFinancialService {
  // Institution Methods
  createInstitution(
    data: FinancialInstitutionDTO
  ): Promise<{ success: boolean; institution?: any; error?: string }>;
  getInstitutionById(
    id: string
  ): Promise<{ success: boolean; institution?: any; error?: string }>;
  getAllInstitutions(): Promise<{
    success: boolean;
    institutions?: any[];
    error?: string;
  }>;
  updateInstitution(
    id: string,
    data: Partial<FinancialInstitutionDTO>
  ): Promise<{ success: boolean; institution?: any; error?: string }>;
  deleteInstitution(id: string): Promise<{ success: boolean; error?: string }>;

  // Product Methods
  createProduct(
    data: FinancialProductDTO
  ): Promise<{ success: boolean; product?: any; error?: string }>;
  getProductById(
    id: string
  ): Promise<{ success: boolean; product?: any; error?: string }>;
  getAllProducts(
    activeOnly?: boolean
  ): Promise<{ success: boolean; products?: any[]; error?: string }>;
  getProductsByInstitution(
    institutionId: string
  ): Promise<{ success: boolean; products?: any[]; error?: string }>;
  updateProduct(
    id: string,
    data: Partial<FinancialProductDTO>
  ): Promise<{ success: boolean; product?: any; error?: string }>;
  deleteProduct(id: string): Promise<{ success: boolean; error?: string }>;

  // Application Methods
  createApplication(
    data: FinancingApplicationDTO
  ): Promise<{ success: boolean; application?: any; error?: string }>;
  getApplicationById(
    id: string
  ): Promise<{ success: boolean; application?: any; error?: string }>;
  getApplicationsByUser(
    userId: string
  ): Promise<{ success: boolean; applications?: any[]; error?: string }>;
  getApplicationsByProduct(
    productId: string
  ): Promise<{ success: boolean; applications?: any[]; error?: string }>;
  updateApplicationStatus(
    id: string,
    data: UpdateFinancingApplicationDTO
  ): Promise<{ success: boolean; application?: any; error?: string }>;
  deleteApplication(id: string): Promise<{ success: boolean; error?: string }>;
}

export function financialService(
  repo: IFinancialRepository
): IFinancialService {
  return {
    // Institution Methods
    createInstitution: async (data) => {
      try {
        const institution = await repo.createInstitution(data);
        return { success: true, institution };
      } catch (err) {
        return { success: false, error: "Failed to create institution" };
      }
    },
    getInstitutionById: async (id) => {
      const institution = await repo.findInstitutionById(id);
      if (!institution)
        return { success: false, error: "Institution not found" };
      return { success: true, institution };
    },
    getAllInstitutions: async () => {
      const institutions = await repo.findAllInstitutions();
      return { success: true, institutions };
    },
    updateInstitution: async (id, data) => {
      const institution = await repo.updateInstitution(id, data);
      if (!institution)
        return { success: false, error: "Institution not found" };
      return { success: true, institution };
    },
    deleteInstitution: async (id) => {
      const success = await repo.deleteInstitution(id);
      if (!success) return { success: false, error: "Institution not found" };
      return { success: true };
    },

    // Product Methods
    createProduct: async (data) => {
      try {
        const product = await repo.createProduct(data);
        return { success: true, product };
      } catch (err) {
        return { success: false, error: "Failed to create product" };
      }
    },
    getProductById: async (id) => {
      const product = await repo.findProductById(id);
      if (!product) return { success: false, error: "Product not found" };
      return { success: true, product };
    },
    getAllProducts: async (activeOnly = true) => {
      const products = await repo.findAllProducts(activeOnly);
      return { success: true, products };
    },
    getProductsByInstitution: async (institutionId) => {
      const products = await repo.findProductsByInstitution(institutionId);
      return { success: true, products };
    },
    updateProduct: async (id, data) => {
      const product = await repo.updateProduct(id, data);
      if (!product) return { success: false, error: "Product not found" };
      return { success: true, product };
    },
    deleteProduct: async (id) => {
      const success = await repo.deleteProduct(id);
      if (!success) return { success: false, error: "Product not found" };
      return { success: true };
    },

    // Application Methods
    createApplication: async (data) => {
      try {
        const applicationData = {
          ...data,
          status: ApplicationStatus.PENDING,
        };
        const application = await repo.createApplication(
          applicationData as any
        );
        return { success: true, application };
      } catch (err) {
        return { success: false, error: "Failed to create application" };
      }
    },
    getApplicationById: async (id) => {
      const application = await repo.findApplicationById(id);
      if (!application)
        return { success: false, error: "Application not found" };
      return { success: true, application };
    },
    getApplicationsByUser: async (userId) => {
      const applications = await repo.findApplicationsByUserId(userId);
      return { success: true, applications };
    },
    getApplicationsByProduct: async (productId) => {
      const applications = await repo.findApplicationsByProductId(productId);
      return { success: true, applications };
    },
    updateApplicationStatus: async (id, data) => {
      try {
        const updateData: Partial<UpdateFinancingApplicationDTO> & {
          processed_at?: Date;
        } = { ...data };

        if (
          data.status === ApplicationStatus.APPROVED ||
          data.status === ApplicationStatus.REJECTED
        ) {
          updateData.processed_at = new Date();
        }

        const application = await repo.updateApplication(id, updateData);
        if (!application) {
          return { success: false, error: "Application not found" };
        }
        // Here you could trigger a notification to the user about the status change.
        return { success: true, application };
      } catch (err) {
        return { success: false, error: "Failed to update application" };
      }
    },
    deleteApplication: async (id) => {
      const success = await repo.deleteApplication(id);
      if (!success) return { success: false, error: "Application not found" };
      return { success: true };
    },
  };
}
