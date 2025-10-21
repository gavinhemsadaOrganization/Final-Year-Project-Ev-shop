import { Express } from 'express';
import { MetricsCollector } from './metricsCollector';
import { createMonitoringRoutes } from './routes';

export function initializeMonitoring(app: Express) {
  // Initialize metrics collector
  const metricsCollector = MetricsCollector.getInstance();
  
  // Apply metrics tracking middleware globally
  app.use(metricsCollector.trackRequest());

  // Register all monitoring routes
  const monitoringRoutes = createMonitoringRoutes();
  app.use(monitoringRoutes);

  console.log('✅ Monitoring endpoints initialized');
}

// Export all monitoring modules
export { MetricsCollector } from './metricsCollector';
export { DatabaseMonitor } from './databaseMonitor';
export { SystemMonitor } from './systemMonitor';
export { healthCheckHandler, HealthCheck } from './healthCheck';  // ADD THIS LINE