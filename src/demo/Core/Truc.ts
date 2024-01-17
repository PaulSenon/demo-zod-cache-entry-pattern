import { isIResolveDependencies } from "./IResolveDependencies";
import IService from "./IService";

type ServiceClass<T extends IService> = { new (): T };

class Truc {
  private services: Map<ServiceClass<IService>, IService> = new Map();

  async get<T extends IService>(Class: ServiceClass<T>): Promise<T | undefined> {
    // 1) Check if the service is already in cache
    const cachedInstance = this.getFromCache(Class);
    if (cachedInstance) return cachedInstance as T;

    // 2) Instantiate the service
    const instance = new Class();

    // 3) (optional) resolve dependencies
    if (isIResolveDependencies(instance)) {
      try {
        await instance.resolveDependencies();
      } catch (e) {
        console.warn(`Failed to resolve dependencies for ${Class.name}`);
      }
    }

    // 4) Initialize the service
    try {
      await instance.init();
    } catch (e) {
      return undefined;
    }

    // 5) Cache the service
    this.setInCache(Class, instance);

    // 6) Return the initialized service instance
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

export default new Truc(); // Singleton
