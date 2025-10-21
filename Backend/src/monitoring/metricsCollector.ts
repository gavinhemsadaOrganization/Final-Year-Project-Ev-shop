export class MetricsCollector {
  private static instance: MetricsCollector;
  private requestCount = 0;
  private errorCount = 0;
  private responseTimes: number[] = [];
  private startTime = Date.now();

  private constructor() {}

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  // Middleware to track requests
  trackRequest() {
    return (req: any, res: any, next: any) => {
      this.requestCount++;
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        this.responseTimes.push(duration);

        // Keep only last 1000 response times
        if (this.responseTimes.length > 1000) {
          this.responseTimes.shift();
        }

        if (res.statusCode >= 400) {
          this.errorCount++;
        }
      });

      next();
    };
  }

  getMetrics() {
    const avgResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      : 0;

    const sortedTimes = [...this.responseTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p95ResponseTime = sortedTimes[p95Index] || 0;

    return {
      requests: {
        total: this.requestCount,
        errors: this.errorCount,
        errorRate: this.requestCount > 0 
          ? ((this.errorCount / this.requestCount) * 100).toFixed(2) + '%'
          : '0%'
      },
      performance: {
        averageResponseTime: avgResponseTime.toFixed(2) + 'ms',
        p95ResponseTime: p95ResponseTime.toFixed(2) + 'ms',
        uptime: ((Date.now() - this.startTime) / 1000).toFixed(0) + 's'
      }
    };
  }

  reset() {
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.startTime = Date.now();
  }
}