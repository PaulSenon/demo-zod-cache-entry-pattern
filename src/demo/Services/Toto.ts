import IResettableService from "../Core/IResettableService";
import IService from "../Core/IService";

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

  async init() {
    this.sdk = await this.loadSDK();
    this.doSomething();
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
