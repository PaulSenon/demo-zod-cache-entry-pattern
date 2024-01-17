import IService from "./IService";

type ServiceClass<T extends IService> = { new (): T };

export default class Truc {
  async get<T extends IService>(Class: ServiceClass<T>): Promise<T> {
    const instance = new Class();
    await instance.init();
    return instance;
  }
}
