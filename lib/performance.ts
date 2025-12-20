/* eslint-disable @typescript-eslint/no-explicit-any */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  start(label: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }

      const metrics = this.metrics.get(label)!;
      metrics.push(duration);

      // Keep only last 100 measurements
      if (metrics.length > 100) {
        metrics.shift();
      }

      // Log slow operations in development
      if (process.env.NODE_ENV === "development" && duration > 100) {
        console.warn(
          `Slow operation detected: ${label} took ${duration.toFixed(2)}ms`
        );
      }
    };
  }

  getAverage(label: string): number {
    const metrics = this.metrics.get(label);
    if (!metrics || metrics.length === 0) return 0;

    const sum = metrics.reduce((a, b) => a + b, 0);
    return sum / metrics.length;
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};

    for (const [label, metrics] of this.metrics.entries()) {
      if (metrics.length > 0) {
        const sum = metrics.reduce((a, b) => a + b, 0);
        result[label] = sum / metrics.length;
      }
    }

    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

// Usage in components:
export function withPerformance<T extends (...args: any[]) => any>(
  label: string,
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const endMeasurement = PerformanceMonitor.getInstance().start(label);
    try {
      const result = fn(...args);

      // Handle async functions
      if (result && typeof result.then === "function") {
        return result.finally(endMeasurement) as ReturnType<T>;
      }

      endMeasurement();
      return result;
    } catch (error) {
      endMeasurement();
      throw error;
    }
  };
}
