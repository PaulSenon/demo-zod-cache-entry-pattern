import Truc from "./Core/Truc";

const config = {
  adobe: () => import("./Services/Adobe"),
  toto: () => import("./Services/Toto"),
};

export const AppContainer = new Truc(config);
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
