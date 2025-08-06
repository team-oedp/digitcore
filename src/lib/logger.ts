/**
 * Debug logger for search functionality and GROQ queries
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = 'search' | 'groq' | 'client' | 'server' | 'general';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: LogContext;
  message: string;
  data?: unknown;
  location?: string;
}

class SearchLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';
  private isStrictMode = this.isDevelopment && this.isClient;
  
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(
    level: LogLevel,
    context: LogContext,
    message: string,
    data?: unknown,
    location?: string
  ): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      context,
      message,
      data,
      location
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) return level === 'error';
    return true;
  }

  private formatMessage(entry: LogEntry): string {
    const prefix = `[${entry.timestamp}] [${entry.context.toUpperCase()}] [${entry.level.toUpperCase()}]`;
    const location = entry.location ? ` (${entry.location})` : '';
    const strictModeNote = this.isStrictMode && entry.level === 'debug' && entry.message.includes('mounted') ? ' [DEV: Double mounting expected]' : '';
    return `${prefix}${location} ${entry.message}${strictModeNote}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const message = this.formatMessage(entry);
    
    // Store logs in sessionStorage for debugging (client-side only)
    if (this.isClient) {
      try {
        const logs = JSON.parse(sessionStorage.getItem('search-debug-logs') || '[]');
        logs.push(entry);
        // Keep only last 100 logs to prevent memory issues
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100);
        }
        sessionStorage.setItem('search-debug-logs', JSON.stringify(logs));
      } catch (e) {
        // Ignore storage errors
      }
    }

    // Console output with appropriate method
    switch (entry.level) {
      case 'debug':
        console.debug(message, entry.data);
        break;
      case 'info':
        console.info(message, entry.data);
        break;
      case 'warn':
        console.warn(message, entry.data);
        break;
      case 'error':
        console.error(message, entry.data);
        break;
    }
  }

  debug(context: LogContext, message: string, data?: unknown, location?: string): void {
    this.log(this.createLogEntry('debug', context, message, data, location));
  }

  info(context: LogContext, message: string, data?: unknown, location?: string): void {
    this.log(this.createLogEntry('info', context, message, data, location));
  }

  warn(context: LogContext, message: string, data?: unknown, location?: string): void {
    this.log(this.createLogEntry('warn', context, message, data, location));
  }

  error(context: LogContext, message: string, data?: unknown, location?: string): void {
    this.log(this.createLogEntry('error', context, message, data, location));
  }

  // Specialized methods for different contexts
  groq(message: string, data?: unknown, location?: string): void {
    this.debug('groq', message, data, location);
  }

  search(message: string, data?: unknown, location?: string): void {
    this.debug('search', message, data, location);
  }

  searchInfo(message: string, data?: unknown, location?: string): void {
    this.info('search', message, data, location);
  }

  searchError(message: string, data?: unknown, location?: string): void {
    this.error('search', message, data, location);
  }

  // Utility to dump all logs (client-side only)
  dumpLogs(): LogEntry[] {
    if (!this.isClient) return [];
    
    try {
      return JSON.parse(sessionStorage.getItem('search-debug-logs') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored logs
  clearLogs(): void {
    if (this.isClient) {
      sessionStorage.removeItem('search-debug-logs');
    }
  }

  // Export logs as text
  exportLogs(): string {
    const logs = this.dumpLogs();
    return logs.map(entry => {
      const message = this.formatMessage(entry);
      return entry.data ? `${message}\nData: ${JSON.stringify(entry.data, null, 2)}` : message;
    }).join('\n\n');
  }
}

// Create singleton instance
export const logger = new SearchLogger();

// Helper function to create location strings
export function createLogLocation(file: string, function_name?: string, line?: number): string {
  let location = file;
  if (function_name) location += `::${function_name}`;
  if (line) location += `:${line}`;
  return location;
}

// Console helper for debugging in browser
if (typeof window !== 'undefined') {
  (window as any).searchLogger = {
    dump: () => logger.dumpLogs(),
    export: () => logger.exportLogs(),
    clear: () => logger.clearLogs(),
    logs: () => console.table(logger.dumpLogs())
  };
}