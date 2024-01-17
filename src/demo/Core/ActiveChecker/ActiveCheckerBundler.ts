import IActiveChecker from "./IActiveChecker";

export default class ActiveCheckerBundler implements IActiveChecker {
  constructor(private readonly checkers: IActiveChecker[]) {}

  async isActive(name: string): Promise<boolean> {
    const allResults = await Promise.allSettled(this.checkers.map((checker) => checker.isActive(name)));
    return allResults.every((result) => result.status === "fulfilled" && result.value);
  }
}
