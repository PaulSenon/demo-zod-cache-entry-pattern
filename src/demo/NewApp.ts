import LoggerFactory from "./Core/Logger/LoggerFactory";
import Truc from "./Core/Truc";
import ConsoleLogger from "./Services/Logger/ConsoleLogger";

const config = {
  adobe: () => import("./Services/Adobe"),
  toto: () => import("./Services/Toto"),
};

const loggerFactory = new LoggerFactory(ConsoleLogger);

export const AppContainer = new Truc(config, loggerFactory);
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
