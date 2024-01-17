import AbstractLogger from "@/demo/Core/Logger/AbstractLogger";

export default class ConsoleLogger extends AbstractLogger {
  debug(message: string): void {
    console.debug(`[${this.name}] ${message}`);
  }
  log(message: string): void {
    console.log(`[${this.name}] ${message}`);
  }
  warn(message: string): void {
    console.warn(`[${this.name}] ${message}`);
  }
  error(message: string): void {
    console.error(`[${this.name}] ${message}`);
  }
}
