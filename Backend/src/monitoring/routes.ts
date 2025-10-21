import express from 'express';
import mongoose from 'mongoose';
import { MetricsCollector } from './metricsCollector';
import { DatabaseMonitor } from './databaseMonitor';
import { SystemMonitor } from './systemMonitor';
import { HealthCheck } from './healthCheck';

export function createMonitoringRoutes() {
  const router = express.Router();
  const metricsCollector = MetricsCollector.getInstance();

  // Basic health check - using HealthCheck class
  router.get('/health', HealthCheck.check);

  // Readiness check
  router.get('/ready', async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database not ready');
      }
      if (!mongoose.connection.db) {
        throw new Error("Database not connected");
      }

      await mongoose.connection.db.admin().command({ ping: 1 });

      res.status(200).json({
        ready: true,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(503).json({
        ready: false,
        reason: error.message
      });
    }
  });

  // Liveness check (minimal)
  router.get('/live', (req, res) => {
    res.status(200).send('OK');
  });

  // Metrics endpoint
  router.get('/metrics', (req, res) => {
    const metrics = metricsCollector.getMetrics();
    const memory = SystemMonitor.getMemoryUsage();
    const cpu = SystemMonitor.getCPUUsage();

    res.json({
      ...metrics,
      system: {
        memory,
        cpu,
        uptime: process.uptime().toFixed(0) + 's'
      }
    });
  });

  // Status/Info endpoint
  router.get('/status', (req, res) => {
    const systemInfo = SystemMonitor.getSystemInfo();

    res.json({
      application: 'EV Platform API',
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      ...systemInfo,
      timestamp: new Date().toISOString()
    });
  });

  // Database health - using DatabaseMonitor helper
  router.get('/health/database', async (req, res) => {
    const health = await DatabaseMonitor.checkHealth();
    const stats = await DatabaseMonitor.getDetailedStats();

    if (health.status === 'ERROR') {
      return res.status(503).json(health);
    }

    res.json({ ...health, ...stats });
  });

  // Session store health - using DatabaseMonitor helper
  router.get('/health/sessions', async (req, res) => {
    const sessionHealth = await DatabaseMonitor.checkSessionStore();

    if (sessionHealth.status === 'ERROR') {
      return res.status(503).json(sessionHealth);
    }

    res.json(sessionHealth);
  });

  // System resources - using SystemMonitor helpers
  router.get('/system', (req, res) => {
    res.json({
      memory: SystemMonitor.getMemoryUsage(),
      cpu: SystemMonitor.getCPUUsage(),
      info: SystemMonitor.getSystemInfo()
    });
  });

  return router;
}