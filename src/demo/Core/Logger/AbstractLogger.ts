import ILogger from "./ILogger";

export default abstract class AbstractLogger implements ILogger {
  constructor(protected readonly name: string) {}

  abstract debug(message: string): void;
  abstract log(message: string): void;
  abstract warn(message: string): void;
  abstract error(message: string): void;
}
