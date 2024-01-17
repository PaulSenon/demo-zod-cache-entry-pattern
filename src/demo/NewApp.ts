import Adobe from "./Services/Adobe";
import Toto from "./Services/Toto";

export default class NewApp {
  private adobe = new Adobe();
  private toto = new Toto();

  async load() {
    await this.adobe.init();
    this.adobe.trackPageView();

    await this.toto.init();
    this.toto.doSomething();
  }

  async reload() {
    this.adobe.sendEvent("reload", {});
    this.toto.doSomething();
  }
}
