/**
 * Secure logging utility for CryptoBoost
 * Prevents sensitive data exposure in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  userId?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private sanitizeMessage(message: string): string {
    // Remove sensitive patterns
    return message
      .replace(/password[=:]\s*[^\s,}]+/gi, 'password=***')
      .replace(/token[=:]\s*[^\s,}]+/gi, 'token=***')
      .replace(/key[=:]\s*[^\s,}]+/gi, 'key=***')
      .replace(/secret[=:]\s*[^\s,}]+/gi, 'secret=***')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '***@***.***');
  }

  private createLogEntry(level: LogLevel, message: string, context?: string): LogEntry {
    return {
      level,
      message: this.sanitizeMessage(message),
      timestamp: new Date().toISOString(),
      context,
      userId: this.getCurrentUserId()
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      // Get user ID from auth store without importing to avoid circular deps
      const authState = localStorage.getItem('auth-storage');
      if (authState) {
        const parsed = JSON.parse(authState);
        return parsed?.state?.user?.id;
      }
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  private addToHistory(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, context?: string) {
    const entry = this.createLogEntry('debug', message, context);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${context ? `[${context}] ` : ''}${entry.message}`);
    }
  }

  info(message: string, context?: string) {
    const entry = this.createLogEntry('info', message, context);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.info(`[INFO] ${context ? `[${context}] ` : ''}${entry.message}`);
    }
  }

  warn(message: string, context?: string) {
    const entry = this.createLogEntry('warn', message, context);
    this.addToHistory(entry);
    
    console.warn(`[WARN] ${context ? `[${context}] ` : ''}${entry.message}`);
  }

  error(message: string, error?: Error, context?: string) {
    const errorMessage = error ? `${message}: ${error.message}` : message;
    const entry = this.createLogEntry('error', errorMessage, context);
    this.addToHistory(entry);
    
    console.error(`[ERROR] ${context ? `[${context}] ` : ''}${entry.message}`);
    
    // In production, send to monitoring service
    if (!this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // In a real app, send to monitoring service like Sentry
      // For now, just store in local storage for admin review
      const existingLogs = localStorage.getItem('app-error-logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(entry);
      
      // Keep only last 50 error logs
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      
      localStorage.setItem('app-error-logs', JSON.stringify(logs));
    } catch {
      // Ignore storage errors
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports
export const logDebug = (message: string, context?: string) => logger.debug(message, context);
export const logInfo = (message: string, context?: string) => logger.info(message, context);
export const logWarn = (message: string, context?: string) => logger.warn(message, context);
export const logError = (message: string, error?: Error, context?: string) => logger.error(message, error, context);
