import {
  FinancialInstitutionDTO,
  FinancialProductDTO,
  FinancingApplicationDTO,
  UpdateFinancingApplicationDTO,
} from "../dtos/financial.DTO";
import { ApplicationStatus } from "../enum/enum";
import { IFinancialRepository } from "../repositories/financial.repository";
import { IUserRepository } from "../repositories/user.repository";
import { UserRole } from "../enum/enum";
import { addFiles, deleteFiles } from "../utils/fileHandel";

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
    data: FinancingApplicationDTO,
    files?: Express.Multer.File[]
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
  updateApplication(
    id: string,
    data: Partial<FinancingApplicationDTO>,
    files?: Express.Multer.File[]
  ): Promise<{ success: boolean; application?: any; error?: string }>;
  deleteApplication(id: string): Promise<{ success: boolean; error?: string }>;
}

export function financialService(
  repo: IFinancialRepository,
  userRepo: IUserRepository
): IFinancialService {
  const folderName = "financial";
  return {
    // Institution Methods
    createInstitution: async (data) => {
      try {
        const user = await userRepo.findById(data.user_id);
        if (!user) return { success: false, error: "User not found" };
        const existingInstitution = await repo.findInstitutionByUserId(
          data.user_id
        );
        if (existingInstitution)
          return { success: false, error: "User already has an institution" };
        user.role.push(UserRole.FINANCE);
        const updatedUser = await user.save();
        if (!updatedUser)
          return { success: false, error: "User role not updated" };

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
      const { user_id, ...filterData } = data;
      const institution = await repo.updateInstitution(id, filterData);
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
        const institution = await repo.findInstitutionById(data.institution_id);
        if (!institution)
          return { success: false, error: "Institution not found" };

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
    createApplication: async (data, files) => {
      try {
        const user = await userRepo.findById(data.user_id);
        if (!user) return { success: false, error: "User not found" };
        const product = await repo.findProductById(data.product_id);
        if (!product) return { success: false, error: "Product not found" };
        if (!product.is_active)
          return { success: false, error: "Product is not active" };
        let filePaths: string[] = [];
        if (files && files.length > 0) {
          filePaths = addFiles(files, folderName);
        }
        const applicationData = {
          ...data,
          application_data: {
            ...data.application_data,
            additional_documents: filePaths, // attach uploaded file paths here
          },
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
        return { success: false, error: "Failed to update application status" };
      }
    },
    updateApplication: async (id, data, files) => {
      try {
        const application = await repo.findApplicationById(id);
        if (!application)
          return { success: false, error: "Application not found" };
        let filePaths: string[] = [];
        if (files && files.length > 0) {
          if (application.application_data.additional_documents) {
            deleteFiles(application.application_data.additional_documents);
          }
          filePaths = addFiles(files, folderName);
        }
        const applicationData = {
          ...data,
          application_data: {
            ...data.application_data,
            additional_documents: filePaths, // attach uploaded file paths here
          },
        };
        const updatedApplication = await repo.updateApplication(
          id,
          applicationData as Partial<FinancingApplicationDTO>
        );
        if (!updatedApplication)
          return { success: false, error: "Application not found" };
        return { success: true, application: updatedApplication };
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
