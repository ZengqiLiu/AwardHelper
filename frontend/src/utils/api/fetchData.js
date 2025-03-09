// src/utils/api/fetchData.js

export async function fetchCountryName(isoCode) {
    try {
      const response = await fetch(`http://localhost:5000/api/country?code=${isoCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data[continentCode] || continentCode;
    } catch (error) {
      console.error("Failed to fetch continents:", error);
      return null;
    }
  }
  