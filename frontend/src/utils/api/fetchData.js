// src/utils/api/fetchData.js

export async function fetchCountryName(isoCode) {
    try {
      const response = await fetch(`http://localhost:5000/api/country?code=${isoCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error when fetching country name! status: ${response.status}`);
      }
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error("Failed to fetch country name:", error);
      return isoCode;
    }
}

export async function fetchContinentName(continentCode) {
    try {
      const response = await fetch('http://localhost:5000/api/continents');
      if (!response.ok) {
        throw new Error(`HTTP error when fetching continents! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data[continentCode] || continentCode;
    } catch (error) {
      console.error("Failed to fetch continents:", error);
      return null;
    }
}

export async function fetchAwardPrograms() {
  try {
    const response = await fetch('http://localhost:5000/api/award-programs');
    if (!response.ok) {
      throw new Error(`HTTP error when fetching award programs! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch award programs:", error);
    return null;
  }
}

export async function fetchProgramDetails(codes) {
  const results = await Promise.all(
    codes.map(async (code) => {
      const response = await fetch(`http://localhost:5000/api/award-programs/${code}`);
      const data = await response.json();
      return { code, data };
    })
  );
  const details = {};
  results.forEach(({ code, data }) => {
    details[code] = data;
  });
  return details;
}

export async function fetchDistance(lat1, lon1, lat2, lon2) {
  try {
    const response = await fetch(`http://localhost:5000/api/distance?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`);
    if (!response.ok) {
      throw new Error(`HTTP error when fetching distance! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch country name:", error);
    return null;
  }
}

export async function fetchAirportDetails(codes) {
  const results = await Promise.all(
    codes.map(async (code) => {
      const response = await fetch(
        `http://localhost:5000/api/search-airport?search=${encodeURIComponent(code)}`
      );
      const data = await response.json();
      return { code, data };
    })
  );
  return results;
}

export async function fetchAirportZone(region, country, continent, awardProgramCode, zoneType) {
  const response = await fetch('http://localhost:5000/api/get-airport-zone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      region,
      country,
      continent,
      awardProgramCode,
      zoneType
    })
  });
  if (!response.ok) {
    throw new Error(`HTTP error when fetching airport zone! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export async function fetchRouteDetails(airportInfo, awardProgramCode, zoneType) {
  const response = await fetch('http://localhost:5000/api/get-route-details', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ airportInfo, awardProgramCode, zoneType })
  });
  if (!response.ok) {
    throw new Error(`HTTP error when fetching route details! status: ${response.status}`);
  }
  return await response.json();
}
