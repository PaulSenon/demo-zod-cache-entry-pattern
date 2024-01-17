import IService from "./IService";

export default interface IResettableService extends IService {
  reset(): Promise<void>;
}

export function isIResettableService(obj: any): obj is IResettableService {
  return obj.reset !== undefined && typeof obj.reset === "function";
}
