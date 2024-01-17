export default interface IResolveDependencies {
  resolveDependencies(): Promise<void>;
}

export function isIResolveDependencies(obj: any): obj is IResolveDependencies {
  return obj.resolveDependencies !== undefined && typeof obj.resolveDependencies === "function";
}
