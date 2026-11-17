const cache = new Map();

/**
 * Devuelve la edad de mayoría de edad (número) para un país por ISO2 (ej: "CO").
 * Si no existe, retorna null.
 */
export async function getAgeOfMajorityByIso2(iso2) {
  if (!iso2) return null;

  const key = iso2.toUpperCase();
  if (cache.has(key)) return cache.get(key);

  const sparql = `
    SELECT ?age WHERE {
      ?country wdt:P297 "${key}".
      ?country p:P2997/psv:P2997 ?ageNode.
      ?ageNode wikibase:quantityAmount ?age.
    }
  `;

  const url =
    "https://query.wikidata.org/sparql?format=json&query=" +
    encodeURIComponent(sparql);

  const res = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      // importante para evitar bloqueos en algunos casos
      "User-Agent": "thuman-frontend/1.0",
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const ages = (data?.results?.bindings || [])
    .map((b) => Number(b.age?.value))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!ages.length) {
    cache.set(key, null);
    return null;
  }

  // Si hubiera más de un valor, toma el menor (lo más común para “mayoría de edad”)
  const age = Math.min(...ages);

  cache.set(key, age);
  return age;
}
