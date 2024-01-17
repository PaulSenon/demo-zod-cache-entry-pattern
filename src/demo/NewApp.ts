import Truc from "./Core/Truc";

export const totoLoader = () => import("./Services/Toto");
export const adobeLoader = () => import("./Services/Adobe");
export default class NewApp {
  async load() {
    const adobe = await Truc.get(adobeLoader);
    adobe?.trackPageView();

    const toto = await Truc.get(totoLoader);
    toto?.doSomething();
  }

  async reload() {
    await Truc.reset(totoLoader);
  }
}
