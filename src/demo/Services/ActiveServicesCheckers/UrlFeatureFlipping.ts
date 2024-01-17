import IActiveChecker from "../../Core/ActiveChecker/IActiveChecker";

export default class UrlFeatureFlipping implements IActiveChecker {
  private url: URL;
  constructor() {
    this.url = new URL(window.location.href);
  }

  isActive(name: string): boolean {
    const disabledFeatures = this.getDisabledFeatures();
    return !disabledFeatures.includes(name);
  }

  private getDisabledFeatures(): string[] {
    const disabledFeatures = this.url.searchParams.get("disabledFeatures");
    if (disabledFeatures) {
      return disabledFeatures.split(",");
    }
    return [];
  }
}
