import IResettableService from "../Core/IResettableService";

const SDL_URL = "https://assets.adobedtm.com/launch-ENf1b4f4b9a0d34c0e9b2a2d5b5b2f5b8e.min.js";

type AdobeSDK = {
  trackPageView: () => void;
  trackEvent: (event: string, data: any) => void;
};

declare global {
  interface Window {
    __adobe_sdk?: AdobeSDK;
  }
}

export default class Adobe implements IResettableService {
  private adobeSDK?: AdobeSDK;

  async init() {
    // ...
    this.adobeSDK = await this.loadSDK();
    // ...
  }

  async reset() {
    // ...
  }

  private loadSDK(): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SDL_URL;
      script.onload = () => resolve(window.__adobe_sdk);
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  }

  trackPageView() {
    this.adobeSDK?.trackPageView();
  }

  sendEvent(event: string, data: any) {
    this.adobeSDK?.trackEvent(event, data);
  }
}
