import ILoggable from "./ILoggable";
import ILogger from "./ILogger";

export default class AbstractLoggable implements ILoggable {
  protected logger!: ILogger;

  setLogger(logger: ILogger) {
    this.logger = logger;
  }
}

export function isAbstractLoggable(obj: any): obj is AbstractLoggable {
  return obj instanceof AbstractLoggable;
}
