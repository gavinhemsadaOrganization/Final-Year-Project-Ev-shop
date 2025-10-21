import mongoose from "mongoose";

export class DatabaseMonitor {
  static async checkHealth() {
    try {
      if (!mongoose.connection.db) {
        throw new Error("Database not connected");
      }

      const start = Date.now();
      await mongoose.connection.db.admin().command({ ping: 1 });
      const responseTime = Date.now() - start;

      return {
        status: "OK",
        responseTime: `${responseTime}ms`,
        readyState: mongoose.connection.readyState,
        readyStateText: [
          "disconnected",
          "connected",
          "connecting",
          "disconnecting",
        ][mongoose.connection.readyState],
      };
    } catch (error: any) {
      return {
        status: "ERROR",
        error: error.message,
      };
    }
  }

  static async getDetailedStats() {
    try {
      if (!mongoose.connection.db) {
        throw new Error("Database not connected");
      }
      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();

      return {
        connections: {
          current: serverStatus.connections?.current || "N/A",
          available: serverStatus.connections?.available || "N/A",
        },
        memory: {
          resident: serverStatus.mem?.resident || "N/A",
          virtual: serverStatus.mem?.virtual || "N/A",
        },
      };
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  }

  static async checkSessionStore() {
    try {
      if (!mongoose.connection.db) {
        throw new Error("Database not connected");
      }
      const sessionsCollection = mongoose.connection.db.collection("sessions");
      const sessionCount = await sessionsCollection.countDocuments();

      return {
        status: "OK",
        activeSessions: sessionCount,
        ttl: "24 hours",
      };
    } catch (error: any) {
      return {
        status: "ERROR",
        error: error.message,
      };
    }
  }
}
