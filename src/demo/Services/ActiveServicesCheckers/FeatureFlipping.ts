import IActiveServiceChecker from "../../Core/ActiveChecker/IActiveChecker";

export default class FeatureFlipping implements IActiveServiceChecker {
  isActive(name: string): boolean {
    switch (name) {
      case "toto":
        return true;
      case "adobe":
        return false;
    }
    return false;
  }
}
