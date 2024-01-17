import IResettableService from "./Core/IResettableService";
import IService from "./Core/IService";
import Truc from "./Core/Truc";
import Adobe from "./Services/Adobe";
import Toto from "./Services/Toto";

export default class NewApp {
  async load() {
    const adobe = await Truc.get(Adobe);
    adobe?.trackPageView();

    const toto = await Truc.get(Toto);
    toto?.doSomething();
  }

  async reload() {
    await Truc.reset(Toto);
  }
}
