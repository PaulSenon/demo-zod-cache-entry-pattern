import IService from "./IService";

type ServiceClass<T extends IService> = { new (): T };

export default class Truc {
  private services: Map<ServiceClass<IService>, IService> = new Map();

  async get<T extends IService>(Class: ServiceClass<T>): Promise<T> {
    // 1) Check if the service is already in cache
    const cachedInstance = this.getFromCache(Class);
    if (cachedInstance) return cachedInstance as T;

    // 2) Instantiate the service
    const instance = new Class();

    // 3) Initialize the service
    await instance.init();

    // 4) Cache the service
    this.setInCache(Class, instance);

    // 5) Return the initialized service instance
    return instance;
  }

  private getFromCache<T extends IService>(Class: ServiceClass<T>): T | undefined {
    const instance = this.services.get(Class);
    if (instance) return instance as T;
    return undefined;
  }

  private setInCache<T extends IService>(Class: ServiceClass<T>, instance: T) {
    this.services.set(Class, instance);
  }
}
