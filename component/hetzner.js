

const filterArrayToQuerystring = (key, filterValues) => filterValues.map(i => key + '=' + i).join('&')

const filtersToQueryString = (filters) => {
  return Object.keys(filters)
    .map(key => !Array.isArray(
      filters[key]) ? `${key}=${filters[key]}` : filterArrayToQuerystring(key, filters[key]
    ))
    .join("&");
}

export async function apiRequest(key, path, filters = {}) {
  const filterString = "?" + filtersToQueryString(filters);
  console.log('Requesting: ', 'https://api.hetzner.cloud' + path + (filterString === '?' ? '' : filterString))
  return fetch('https://api.hetzner.cloud' + path + (filterString === '?' ? '' : filterString), {
    headers: {
      'Authorization': `Bearer ${key}`,
    },
  }).then(res => res.ok ? res.json() : Promise.reject(res.json()));
}

export async function getNetworksByZone(key, zone) {
  const allNetworks = await apiRequest(key, '/v1/networks')
  return allNetworks
    .filter(i => i.subnets
    .reduce((acc, a) => acc || a.network_zone === regionDetails.network_zone, false))
}

