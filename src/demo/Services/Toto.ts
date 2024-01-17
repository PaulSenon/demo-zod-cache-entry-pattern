import IResolveDependencies from "../Core/IResolveDependencies";
import IService from "../Core/IService";
import Truc from "../Core/Truc";
import { AppContainer } from "../NewApp";
import type Adobe from "./Adobe";

const SDK_URL = "https://sdktoto.com/sdk.js";

type TotoSDK = {
  somethingReallyInteresting: () => void;
};

declare global {
  interface Window {
    totoSdk?: TotoSDK;
  }
}

export default class Toto implements IService, IResolveDependencies {
  private sdk?: any;
  private adobe?: Adobe;

  async resolveDependencies() {
    this.adobe = await AppContainer.get("adobe", this);
  }

  async init() {
    // ...
    this.sdk = await this.loadSDK();
    this.adobe?.sendEvent("toto-init", {});
    // ...
  }

  private loadSDK(): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SDK_URL;
      script.onload = () => resolve(window.totoSdk);
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  }

  doSomething() {
    this.sdk?.somethingReallyInteresting();
    this.adobe?.sendEvent("toto-something", {});
  }
}
