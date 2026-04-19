/**
 * Thin async helper used by the typed API stubs.
 * Simulates network latency so the UI exposes its loading states correctly.
 * When the Spring Boot backend is wired, replace with a fetch-based client.
 */
export function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
