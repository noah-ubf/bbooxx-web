import { useViewContext } from "@lib/viewContext";

const API = `http://${window.location.hostname}:6069/api/`;
const respCache = [];
const CACHE_SIZE = 1000;

async function fetchURI(uri) {
  const cached = respCache.find((el) => (el.uri === uri));
  if (cached) return cached.data;
  const response = await fetch(`${API}${uri}`);
  const data = await response.json();
  respCache.unshift({uri,data});
  if (respCache.length > CACHE_SIZE) respCache.length = CACHE_SIZE;
  return data;
}

function useFetch() {
  const { handlers: { startLoading, finishLoading } } = useViewContext();
  return async (uri) => {
    startLoading();
    const data = await fetchURI(uri);
    finishLoading();
    return data;
  }
}

export { fetchURI, useFetch };