import DependencyGraph from "./DependencyGraph";
import { isIResettableService } from "./IResettableService";
import { isIResolveDependencies } from "./IResolveDependencies";
import IService from "./IService";

export type ServiceClass<T extends IService> = { new (): T };

class Truc {
  private services: Map<ServiceClass<IService>, IService> = new Map();
  private dependencyGraph = new DependencyGraph();

  async get<T extends IService>(Class: ServiceClass<T>, parent: IService | Truc = this): Promise<T | undefined> {
    // 0) Add dependency graph entry
    this.dependencyGraph.addDependency(parent, Class);

    // 1) Check if the service is already in cache
    const cachedInstance = this.getFromCache(Class);
    if (cachedInstance) {
      // set dependency graph entry
      return cachedInstance as T;
    }

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

  async reset<T extends IService>(Class: ServiceClass<T>): Promise<void> {
    // 1) Check if the is already in cache (aka has been initialized)
    const instance = this.getFromCache(Class);
    if (!instance) {
      console.warn(`Cannot reset an service that has not been initialized yet ${Class.name}`);
      return;
    }

    // 2) Reset children recursively
    const children = this.dependencyGraph.getChildren(instance);
    for (const child of children) {
      await this.reset(child);
    }

    // 3) Reset the service if it is resettable
    if (isIResettableService(instance)) {
      await instance.reset();
    }
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
