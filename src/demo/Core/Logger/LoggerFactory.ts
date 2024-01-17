import AbstractLogger from "./AbstractLogger";
import ILoggerFactory from "./ILoggerFactory";

type ClassType<T> = new (...args: any[]) => T;
export default class LoggerFactory<T extends AbstractLogger> implements ILoggerFactory<T> {
  private readonly loggers: Map<string, T> = new Map();

  constructor(private readonly LoggerClass: ClassType<T>) {}

  getLogger(name: string): T {
    if (!this.loggers.has(name)) {
      this.loggers.set(name, this.createLogger(name));
    }

    return this.loggers.get(name)!;
  }

  private createLogger(name: string): T {
    return new this.LoggerClass(name);
  }
}
