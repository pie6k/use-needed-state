import { proxyEqual, proxyState } from 'proxyequal';
import { SetStateAction, useCallback, useMemo, useState } from 'react';
import {
  compareMaybePrimitives,
  wrapValue,
  unwrapValue,
  PrimiviteWrapper,
} from './primitiveWrapper';

export function useNeededState<T>(initialValue: T | (() => T)) {
  // state of actual value
  const [originalValue, setValue] = useState(initialValue);
  /**
   * value spy that will allow us to know what parts of state were actually used during every render
   */
  const valueProxySpy = useMemo(
    () => proxyState<PrimiviteWrapper<T>>(wrapValue(originalValue)),
    [],
  );

  const updateState = useCallback((newStateAction: SetStateAction<T>) => {
    setValue((currentValue) => {
      // first - calculate what next state will be
      const newValue = getNextState(currentValue, newStateAction);

      /**
       * before we'll use spy to check if re-render is needed - let's make cheap check for primitive values like bools, numbers, strings etc
       * this function will return boolean if those values are primitives telling if they're equal
       * or undefined if values are not primitives
       */
      const isEqualIfPrimitive = compareMaybePrimitives(newValue, currentValue);

      // skip update - values are equal primitives
      if (isEqualIfPrimitive === true) {
        return currentValue;
      }

      // values are primitives and are not equal - commit update and re-render
      if (isEqualIfPrimitive === false) {
        valueProxySpy.replaceState(wrapValue(newValue));
        return newValue;
      }

      /**
       * value is not primitive - we can use spy to check if update is needed
       *
       * value inside spy is wrapped inside simple {__value: state} wrapper, so primitives can be
       * spied too.
       *
       * first - let's check if spy detected any other access than un-wrapping the value
       * if the only access to the state object was un-wrapping it - it means state was not used in any way
       * and we can skip update
       */
      //
      if (valueProxySpy.affected.length === 1 && valueProxySpy.affected[0] === '.__value') {
        // skip update
        return currentValue;
      }

      /**
       * some part of state was used during last render
       * let's compare old and new state to see if used parts are equal or not
       * if they're equal, even if other parts of the state are different - we don't need to re-render
       */
      const isUsedPartSame = proxyEqual(
        wrapValue(newValue),
        wrapValue(currentValue),
        valueProxySpy.affected,
      );

      // skip update if used part is the same
      if (isUsedPartSame) {
        return currentValue;
      }

      // reset spy with new value
      valueProxySpy.replaceState(wrapValue(newValue));

      // commit update
      return newValue;
    });
  }, []);

  return [unwrapValue(valueProxySpy.state), updateState] as const;
}

function getNextState<T>(previous: T, stateAction: SetStateAction<T>) {
  if (typeof stateAction === 'function') {
    return (stateAction as (p: T) => T)(previous);
  }

  return stateAction;
}
