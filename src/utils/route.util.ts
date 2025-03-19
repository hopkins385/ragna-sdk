function getRoute<T extends string>(
  route: T,
  params?: Record<string, string>
): T {
  if (!route) throw new Error("Route is required");
  if (!params) return route;

  let newRoute: string = route;
  for (const [key, value] of Object.entries(params)) {
    if (!newRoute.includes(key)) {
      throw new Error(`Route does not contain parameter ${key}`);
    }
    if (!value.trim()) {
      throw new Error(`Value for ${key} cannot be empty`);
    }
    newRoute = newRoute.replace(key, value.toLowerCase());
  }

  return newRoute as T;
}

export { getRoute };
