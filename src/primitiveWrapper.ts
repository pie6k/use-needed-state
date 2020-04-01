/**
 * State might be primitive. Proxy Equal does not support primitives yet. That's why
 * I'm always wrapping values in a small object and keep/compare it inside it,
 * while when returning - I'm unwrapping it
 */

export interface PrimiviteWrapper<T> {
  __value: T;
}

export function wrapValue<T>(value: T): PrimiviteWrapper<T> {
  return { __value: value };
}

export function unwrapValue<T>(wrapped: PrimiviteWrapper<T>): T {
  return wrapped.__value;
}

export function compareMaybePrimitives(a: any, b: any): boolean | null {
  if (a === b) {
    return true;
  }

  if (isPrimivite(a) || isPrimivite(b)) {
    return false;
  }

  return null;
}

type Primitive = string | number | boolean | null | undefined | void;

// it's working the same way as lodash isObject
function isObject(value: any) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

export function isPrimivite(input: any): input is Primitive {
  return !isObject(input);
}
