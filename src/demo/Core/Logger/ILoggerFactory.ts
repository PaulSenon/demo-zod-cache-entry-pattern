import ILogger from "./ILogger";

export default interface ILoggerFactory<T extends ILogger = ILogger> {
  getLogger(name: string): T;
}
