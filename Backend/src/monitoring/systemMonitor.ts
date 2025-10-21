export class SystemMonitor {
  static getMemoryUsage() {
    const mem = process.memoryUsage();
    return {
      heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      rss: (mem.rss / 1024 / 1024).toFixed(2) + ' MB',
      external: (mem.external / 1024 / 1024).toFixed(2) + ' MB',
      usagePercentage: ((mem.heapUsed / mem.heapTotal) * 100).toFixed(2) + '%'
    };
  }

  static getCPUUsage() {
    const usage = process.cpuUsage();
    return {
      user: (usage.user / 1000000).toFixed(2) + 's',
      system: (usage.system / 1000000).toFixed(2) + 's'
    };
  }

  static getSystemInfo() {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime().toFixed(0) + 's'
    };
  }
}