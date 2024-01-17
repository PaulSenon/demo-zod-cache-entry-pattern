import IResettableService from "../Core/IResettableService";
import IService from "../Core/IService";
import Truc from "../Core/Truc";
import Adobe from "./Adobe";

const SDK_URL = "https://sdktoto.com/sdk.js";

type TotoSDK = {
  somethingReallyInteresting: () => void;
};

declare global {
  interface Window {
    totoSdk?: TotoSDK;
  }
}

export default class Toto implements IService {
  private sdk?: any;
  private adobe?: Adobe;

  async init() {
    // ...
    this.sdk = await this.loadSDK();
    this.adobe = await Truc.get(Adobe);
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
  }
}
