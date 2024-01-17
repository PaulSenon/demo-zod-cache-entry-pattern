import IService from "./IService";
import Truc, { ServiceClass } from "./Truc";

export default class DependencyGraph {
  private dependencyGraph: Map<IService | typeof Truc, Set<ServiceClass<IService>>> = new Map();

  public addDependency(parent: IService | typeof Truc, child: ServiceClass<IService>) {
    const children = this.dependencyGraph.get(parent);
    if (children) {
      children.add(child);
    } else {
      this.dependencyGraph.set(parent, new Set([child]));
    }
  }

  public getChildren(parent: IService | typeof Truc): ServiceClass<IService>[] {
    const children = this.dependencyGraph.get(parent);
    if (children) {
      return Array.from(children);
    } else {
      return [];
    }
  }
}
