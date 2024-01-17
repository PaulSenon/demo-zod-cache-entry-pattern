export default interface IIsEnabled {
  isEnabled(): Promise<boolean> | boolean;
}

export function isIIsEnabled(obj: any): obj is IIsEnabled {
  return obj.isEnabled !== undefined && typeof obj.isEnabled === "function";
}
