export function apiRequest(key, path, filters = {}) {
  const filterString = "?" + Object.keys(filters).map(key => `${key}=${filters[key]}`).join("&");
  console.log('Requesting from','https://api.hetzner.cloud' + path + filterString === '?' ? '' : filterString)
  return fetch('https://api.hetzner.cloud' + path + filterString === '?' ? '' : filterString, {
    headers: {
      'Authorization': `Bearer ${key}`,
    },
  }).then(res => res.ok ? res.json() : Promise.reject(res.json()));
}
