import DependencyGraph from "./DependencyGraph";
import IResettableService, { isIResettableService } from "./IResettableService";
import { isIResolveDependencies } from "./IResolveDependencies";
import IService from "./IService";
import { isAbstractLoggable } from "./Logger/AbstractLoggable";
import ILoggerFactory from "./Logger/ILoggerFactory";
import ILogger from "./Logger/ILogger";

export type ServiceClass<T extends IService> = { new (): T };

export type Loader<T extends IService> = () => Promise<{ default: ServiceClass<T> }>;
export type BaseConfig = {
  [key: string]: Loader<IService>;
};
export type LoadedType<T extends Loader<IService>> = T extends Loader<infer U> ? U : never;
export type ConfigKeysMatchingType<C extends BaseConfig, T> = {
  [K in keyof C]: LoadedType<C[K]> extends T ? K : never;
}[keyof C];

export type ConfigIncludingType<C extends BaseConfig, T> = Pick<C, ConfigKeysMatchingType<C, T>>;

export type ConfigKeysExcludingType<C extends BaseConfig, T> = {
  [K in keyof C]: LoadedType<C[K]> extends T ? never : K;
}[keyof C];

export type ConfigExcludingType<C extends BaseConfig, T> = Pick<C, ConfigKeysExcludingType<C, T>>;

const RootKey = "root";
export type RootKey = typeof RootKey;

export default class Truc<const Config extends BaseConfig> {
  private services: Map<keyof Config, IService> = new Map();
  private dependencyGraph = new DependencyGraph(this);
  private logger: ILogger;

  constructor(
    private config: Config,
    private loggerFactory: ILoggerFactory
  ) {
    this.logger = loggerFactory.getLogger(RootKey);
  }

  async get<const Key extends keyof Config & string, const T extends LoadedType<Config[Key]>>(
    key: Key,
    parent?: IService
  ): Promise<T | undefined> {
    // 0) Add dependency graph entry
    this.dependencyGraph.addDependency(parent ?? this, key);

    // 1) Check if the service is already in cache
    const cachedInstance = this.getFromCache(key);
    if (cachedInstance) return cachedInstance as T;

    // 2) get loader from config
    const loader = this.config[key];

    // 3) Load the service
    const { default: Class } = await loader();

    // 4) Instantiate the service
    const instance = new Class() as T;

    // 5) (optional) set logger
    if (isAbstractLoggable(instance)) {
      const logger = this.loggerFactory.getLogger(key);
      instance.setLogger(logger);
    }

    // 6) (optional) resolve dependencies
    if (isIResolveDependencies(instance)) {
      try {
        await instance.resolveDependencies();
      } catch (e) {
        this.logger.warn(`Failed to resolve dependencies for ${Class.name}`);
      }
    }

    // 7) Initialize the service
    try {
      await instance.init();
    } catch (e) {
      return undefined;
    }

    // 8) Cache the service
    this.setInCache(key, instance);

    // 9) Return the initialized service instance
    return instance;
  }

  async reset<RKeys extends keyof ConfigIncludingType<Config, IResettableService>>(key?: RKeys): Promise<void> {
    const _key: RKeys | RootKey = key ?? "root";

    // 1) Check if the is already in cache (aka has been initialized)
    const instance = this.getFromCache(_key);
    if (!instance) {
      this.logger.warn(`Cannot reset an service that has not been initialized yet`);
      return;
    }

    // 2) Reset children recursively
    const children = this.dependencyGraph.getChildren(instance);
    for (const child of children) {
      await this.reset(child as RKeys);
    }

    // 3) Reset the service if it is resettable
    if (isIResettableService(instance)) {
      await instance.reset();
    }
  }

  private getFromCache<Key extends keyof Config, T extends LoadedType<Config[Key]>>(key: Key): T | undefined {
    const instance = this.services.get(key);
    if (instance) return instance as T;
    return undefined;
  }

  private setInCache<Key extends keyof Config, T extends LoadedType<Config[Key]>>(key: Key, instance: T) {
    this.services.set(key, instance);
  }
}

