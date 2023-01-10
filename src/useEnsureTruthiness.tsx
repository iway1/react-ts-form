import { useRef } from "react";

export function useEnsureTruthinessAccrossRenders(message: string) {
  return `@ts-react/form: ${message}`;
}

/**
 * Makes sure that a form value is either defined or undefined for the lifetime of the containing component.
 */
export function useEnsureTruthinessAcrossRenders({
  thing,
  message,
}: {
  message: string;
  thing?: any;
}) {
  const thingRef = useRef<any>(thing);
  if (!!thingRef.current !== !!thing) {
    throw new Error(useEnsureTruthinessAccrossRenders(message));
  }
}
