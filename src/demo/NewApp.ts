import ActiveCheckerBundler from "./Core/ActiveChecker/ActiveCheckerBundler";
import LoggerFactory from "./Core/Logger/LoggerFactory";
import Truc from "./Core/Truc";
import FeatureFlipping from "./Services/ActiveServicesCheckers/FeatureFlipping";
import ConsoleLogger from "./Services/Logger/ConsoleLogger";
import UrlFeatureFlipping from "./Services/ActiveServicesCheckers/UrlFeatureFlipping";

const config = {
  adobe: () => import("./Services/Adobe"),
  toto: () => import("./Services/Toto"),
};

const activeServicesChecker = new ActiveCheckerBundler([new FeatureFlipping(), new UrlFeatureFlipping()]);
const loggerFactory = new LoggerFactory(ConsoleLogger);

export const AppContainer = new Truc(config, loggerFactory, activeServicesChecker);
export default class NewApp {
  async load() {
    const adobe = await AppContainer.get("adobe");
    adobe?.trackPageView();

    const toto = await AppContainer.get("toto");
    toto?.doSomething();
  }

  async reload() {
    await AppContainer.reset("adobe");
  }
}
