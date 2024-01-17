import type Adobe from "./Services/Adobe";
import Toto from "./Services/Toto";

export default class App {
  private adobe?: Adobe;
  private toto?: Toto;

  async loadContext(ctx: string) {
    switch (ctx) {
      case "home":
        await this.loadHomeContext();
        break;
      case "article":
        await this.loadArticleContext();
        break;
      default:
        console.error("Unknown context");
        break;
    }
  }

  async reset() {
    this.reloadAdobe();
    this.reloadToto();
  }

  async loadHomeContext() {
    await this.loadAdobe();
  }

  async loadArticleContext() {
    await this.loadAdobe();
    await this.loadToto();
  }

  async loadAdobe() {
    if (this.adobe) return;

    const { default: Adobe } = await import("./Services/Adobe");
    this.adobe = new Adobe();
    await this.adobe.init();

    this.adobe.trackPageView();
  }

  async reloadAdobe() {
    if (!this.adobe) return;

    this.adobe.sendEvent("reload", {});
  }

  async loadToto() {
    if (this.toto) return;
    const { default: Toto } = await import("./Services/Toto");
    this.toto = new Toto();
    await this.toto.init();

    this.toto.doSomething();
  }

  async reloadToto() {
    if (!this.toto) return;

    this.toto.doSomething();
  }
}
