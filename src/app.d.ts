// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: import("lucia").User | null;
      session: import("lucia").Session | null;
    }
    interface Platform {
      env: {
        COUNTER: DurableObjectNamespace;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache }
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
  var db: LibSQLDatabase;
}

export { };
