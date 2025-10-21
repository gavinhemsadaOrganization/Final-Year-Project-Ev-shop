import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface HealthCheckResponse {
  uptime: number;
  status: string;
  timestamp: string;
  checks: {
    database: string;
    memory: string;
  };
}

export async function healthCheckHandler(req: Request, res: Response): Promise<void> {
  const healthCheck: HealthCheckResponse = {
    uptime: process.uptime(),
    status: "OK",
    timestamp: new Date().toISOString(),
    checks: {
      database: "OK",
      memory: "OK",
    },
  };

  try {
    // 1. Check if the Mongoose connection object's 'db' property exists
    if (!mongoose.connection.db) {
      // If 'db' is not defined, the database connection is not ready.
      throw new Error("Database not connected");
    }
    
    // 2. Ping the MongoDB database to verify connection
    // This sends a simple 'ping' command to the MongoDB admin database to check its responsiveness.
    await mongoose.connection.db.admin().command({ ping: 1 });

    // Check application memory usage
    const memUsage = process.memoryUsage();
    const memThreshold = 0.9; // Define a memory usage threshold (90%)
    
    // If heap used exceeds 90% of total heap, set memory status to WARNING
    if (memUsage.heapUsed / memUsage.heapTotal > memThreshold) {
      healthCheck.checks.memory = "WARNING";
    }

    // If all checks pass, send a 200 OK response with health status
    res.status(200).json(healthCheck);
  } catch (error) {
    // If any error occurs during health checks, set status to ERROR
    healthCheck.status = "ERROR";
    healthCheck.checks.database = "ERROR";
    
    // Send a 503 Service Unavailable response with the error status
    res.status(503).json(healthCheck);
  }
}

// Alternative: Class-based approach
export class HealthCheck {
  static async check(req: Request, res: Response): Promise<void> {
    const healthCheck: HealthCheckResponse = {
      uptime: process.uptime(),
      status: "OK",
      timestamp: new Date().toISOString(),
      checks: {
        database: "OK",
        memory: "OK",
      },
    };

    try {
      // Check database connection
      if (!mongoose.connection.db) {
        throw new Error("Database not connected");
      }
      
      await mongoose.connection.db.admin().command({ ping: 1 });

      // Check memory usage
      const memUsage = process.memoryUsage();
      const memThreshold = 0.9;
      
      if (memUsage.heapUsed / memUsage.heapTotal > memThreshold) {
        healthCheck.checks.memory = "WARNING";
      }

      res.status(200).json(healthCheck);
    } catch (error) {
      healthCheck.status = "ERROR";
      healthCheck.checks.database = "ERROR";
      res.status(503).json(healthCheck);
    }
  }

  // Additional helper method to check database only
  static async checkDatabase(): Promise<{ status: string; error?: string }> {
    try {
      if (!mongoose.connection.db) {
        throw new Error("Database not connected");
      }
      await mongoose.connection.db.admin().command({ ping: 1 });
      return { status: "OK" };
    } catch (error: any) {
      return { status: "ERROR", error: error.message };
    }
  }

  // Additional helper method to check memory only
  static checkMemory(threshold: number = 0.9): { status: string; usage: number } {
    const memUsage = process.memoryUsage();
    const usage = memUsage.heapUsed / memUsage.heapTotal;
    
    return {
      status: usage > threshold ? "WARNING" : "OK",
      usage: parseFloat((usage * 100).toFixed(2))
    };
  }
}