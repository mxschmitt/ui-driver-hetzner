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
  const allNetworks = (await apiRequest(key, '/v1/networks')).networks
  return allNetworks
    .filter(i => i.subnets
      .reduce((acc, a) => acc || a.network_zone === zone, false))
}

export async function getBaseData(apiKey) {
  const [
    locations,
    serverTypes,
    sshKeys,
    firewalls,
    placementGroups
  ] = await Promise.all([
    apiRequest(apiKey, '/v1/locations'),
    apiRequest(apiKey, '/v1/server_types'),
    apiRequest(apiKey, '/v1/ssh_keys'),
    apiRequest(apiKey, '/v1/firewalls'),
    apiRequest(apiKey, '/v1/placement_groups')
  ])

  return {
    locations: locations.locations,
    serverTypes: serverTypes.server_types,
    sshKeys: sshKeys.ssh_keys,
    firewalls: firewalls.firewalls,
    placementGroups: placementGroups.placement_groups
  }
}

export async function getArchitectureImagesSorted (apiKey, architecture) {
  return (await apiRequest(apiKey, '/v1/images', { type: ['system', 'snapshot', 'backup'], architecture })).images
    .sort((a, b) => a.name > b.name ? 1 : -1)
}

