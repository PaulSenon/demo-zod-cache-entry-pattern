import ILogger from "./ILogger";

export default interface ILoggable {
  setLogger(logger: ILogger): void;
}
