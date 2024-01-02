import { Json } from "@/Common/Types/Json.types";
import { createTypeChecker } from "@/Zod/ZodUtils/createTypeChecker";

export const CacheValueType = Json;
export type CacheValueType = Json;
export const isCacheValueType = createTypeChecker(CacheValueType);
