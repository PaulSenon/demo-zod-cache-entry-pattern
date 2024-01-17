export default interface ILogger {
  debug(message: string): void;
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}
