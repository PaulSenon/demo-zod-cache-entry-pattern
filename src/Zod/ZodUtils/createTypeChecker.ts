import { z } from "zod";

/**
 * To build a typechecker function from a zod schema
 */
export function createTypeChecker<const TData>(schema: z.Schema<TData>): (input: unknown) => input is TData {
  return (input: unknown): input is TData => {
    const result = schema.safeParse(input);
    return result.success === true;
  };
}
