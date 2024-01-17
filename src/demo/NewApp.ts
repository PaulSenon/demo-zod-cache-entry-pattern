import Truc from "./Core/Truc";
import Adobe from "./Services/Adobe";
import Toto from "./Services/Toto";

export default class NewApp {
  private truc = new Truc();

  async load() {
    const adobe = await this.truc.get(Adobe);
    adobe.trackPageView();

    const toto = await this.truc.get(Toto);
    toto.doSomething();
  }

  // async reload() {
  //   this.adobe.sendEvent("reload", {});
  //   this.toto.doSomething();
  // }
}
