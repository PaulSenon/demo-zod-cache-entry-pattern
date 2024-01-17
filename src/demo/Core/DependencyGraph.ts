import IService from "./IService";
import Truc, { BaseConfig } from "./Truc";

export default class DependencyGraph<C extends BaseConfig> {
  private dependencyGraph: Map<IService | Truc<C>, Set<keyof C>> = new Map();

  constructor(private truc: Truc<C>) {
    void truc;
  }

  public addDependency(parent: IService | Truc<C>, child: keyof C) {
    const children = this.dependencyGraph.get(parent);
    if (children) {
      children.add(child);
    } else {
      this.dependencyGraph.set(parent, new Set([child]));
    }
  }

  public getChildren(parent: IService | Truc<C>): (keyof C)[] {
    const children = this.dependencyGraph.get(parent);
    if (children) {
      return Array.from(children);
    } else {
      return [];
    }
  }
}
