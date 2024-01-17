import DependencyGraph from "./DependencyGraph";
import { isIResettableService } from "./IResettableService";
import { isIResolveDependencies } from "./IResolveDependencies";
import IService from "./IService";

export type ServiceClass<T extends IService> = { new (): T };

export type Loader<T extends IService> = () => Promise<{ default: ServiceClass<T> }>;

class Truc {
  private services: Map<Loader<IService>, IService> = new Map();
  private dependencyGraph = new DependencyGraph();

  async get<T extends IService>(loader: Loader<T>, parent: IService | Truc = this): Promise<T | undefined> {
    // 0) Add dependency graph entry
    this.dependencyGraph.addDependency(parent, loader);

    // 1) Check if the service is already in cache
    const cachedInstance = this.getFromCache(loader);
    if (cachedInstance) {
      // set dependency graph entry
      return cachedInstance as T;
    }

    // 2) Load the service
    const { default: Class } = await loader();

    // 3) Instantiate the service
    const instance = new Class();

    // 4) (optional) resolve dependencies
    if (isIResolveDependencies(instance)) {
      try {
        await instance.resolveDependencies();
      } catch (e) {
        console.warn(`Failed to resolve dependencies for ${Class.name}`);
      }
    }

    // 5) Initialize the service
    try {
      await instance.init();
    } catch (e) {
      return undefined;
    }

    // 6) Cache the service
    this.setInCache(loader, instance);

    // 7) Return the initialized service instance
    return instance;
  }

  async reset<T extends IService>(loader: Loader<T>): Promise<void> {
    // 1) Check if the is already in cache (aka has been initialized)
    const instance = this.getFromCache(loader);
    if (!instance) {
      console.warn(`Cannot reset an service that has not been initialized yet`);
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

  private getFromCache<T extends IService>(loader: Loader<T>): T | undefined {
    const instance = this.services.get(loader);
    if (instance) return instance as T;
    return undefined;
  }

  private setInCache<T extends IService>(loader: Loader<T>, instance: T) {
    this.services.set(loader, instance);
  }
}

export default new Truc(); // Singleton
