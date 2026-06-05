import { cardmemDriver } from "./cardmem";
import { genericDriver } from "./generic";
import type { AdapterDriver } from "./types";

export * from "./types";
export { cardmemDriver } from "./cardmem";
export { genericDriver } from "./generic";

const drivers: Record<string, AdapterDriver> = {
  cardmem: cardmemDriver,
  generic: genericDriver,
};

/** Resolve a driver by adapter type; unknown types fall back to the generic URL+token driver. */
export function driverFor(type: string): AdapterDriver {
  return drivers[type] ?? genericDriver;
}
