export type AreaCity = {
  id: string;
  label: string;
  query: string;
  lat: number;
  lng: number;
};

export type AreaRegion = {
  id: string;
  label: string;
  query: string;
  lat: number;
  lng: number;
  zoom: number;
  cities: AreaCity[];
};

function cities(regionQuery: string, places: [string, number, number][]): AreaCity[] {
  return places.map(([label, lat, lng]) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    label,
    query: `${label}, ${regionQuery}`,
    lat,
    lng,
  }));
}

export const serviceAreas: AreaRegion[] = [
  {
    id: "san-diego",
    label: "San Diego",
    query: "San Diego, California",
    lat: 32.86,
    lng: -117.05,
    zoom: 9,
    cities: cities("San Diego, CA", [
      ["Alpine", 32.835, -116.766],
      ["Bonita", 32.658, -117.03],
      ["Poway", 32.963, -117.036],
      ["Del Mar", 32.96, -117.265],
      ["National City", 32.678, -117.099],
      ["Lemon Grove", 32.742, -117.031],
      ["Rancho Santa Fe", 33.021, -117.202],
      ["San Diego", 32.716, -117.161],
      ["Lakeside", 32.858, -116.922],
      ["Jamul", 32.717, -116.876],
      ["La Jolla", 32.833, -117.272],
      ["Spring Valley", 32.745, -116.999],
      ["San Ysidro", 32.555, -117.047],
      ["Santee", 32.838, -116.974],
      ["Imperial Beach", 32.584, -117.113],
      ["Chula Vista", 32.64, -117.084],
      ["El Cajon", 32.795, -116.963],
      ["La Mesa", 32.768, -117.023],
      ["Solana Beach", 32.991, -117.271],
    ]),
  },
  {
    id: "orange-county",
    label: "Orange County",
    query: "Orange County, California",
    lat: 33.7,
    lng: -117.8,
    zoom: 10,
    cities: cities("Orange County, CA", [
      ["Anaheim", 33.836, -117.914],
      ["Anaheim Hills", 33.851, -117.76],
      ["Santa Ana", 33.745, -117.868],
      ["Orange", 33.788, -117.853],
      ["Garden Grove", 33.774, -117.941],
      ["Westminster", 33.759, -117.994],
      ["Fountain Valley", 33.709, -117.954],
      ["Huntington Beach", 33.66, -117.999],
      ["Costa Mesa", 33.641, -117.919],
      ["Newport Beach", 33.618, -117.929],
      ["Newport Coast", 33.597, -117.827],
      ["Fullerton", 33.87, -117.924],
      ["Brea", 33.917, -117.9],
      ["Placentia", 33.872, -117.87],
      ["Yorba Linda", 33.889, -117.813],
      ["Buena Park", 33.868, -117.998],
      ["La Habra", 33.932, -117.946],
      ["Cypress", 33.817, -118.037],
      ["Stanton", 33.803, -117.993],
      ["Seal Beach", 33.741, -118.105],
      ["Los Alamitos", 33.803, -118.073],
      ["La Palma", 33.846, -118.047],
      ["Villa Park", 33.814, -117.813],
    ]),
  },
  {
    id: "los-angeles",
    label: "Los Angeles",
    query: "Los Angeles, California",
    lat: 34.02,
    lng: -118.4,
    zoom: 9,
    cities: cities("Los Angeles, CA", [
      ["Los Angeles", 34.052, -118.244],
      ["Beverly Hills", 34.073, -118.401],
      ["West Hollywood", 34.09, -118.362],
      ["Hollywood", 34.098, -118.327],
      ["Culver City", 34.021, -118.396],
      ["Westwood", 34.063, -118.445],
      ["Brentwood", 34.052, -118.474],
      ["Santa Monica", 34.019, -118.491],
      ["Venice", 33.985, -118.47],
      ["Marina Del Rey", 33.98, -118.452],
      ["Malibu", 34.025, -118.78],
      ["Pacific Palisades", 34.048, -118.526],
      ["Playa del Rey", 33.957, -118.441],
      ["Playa Vista", 33.975, -118.419],
      ["Burbank", 34.181, -118.309],
      ["Glendale", 34.142, -118.255],
      ["Pasadena", 34.148, -118.145],
      ["Studio City", 34.14, -118.396],
      ["North Hollywood", 34.187, -118.379],
      ["Sherman Oaks", 34.151, -118.449],
      ["Encino", 34.159, -118.501],
      ["Van Nuys", 34.19, -118.449],
      ["Valley Village", 34.164, -118.396],
      ["Toluca Lake", 34.152, -118.357],
      ["Tarzana", 34.173, -118.553],
      ["Reseda", 34.201, -118.536],
      ["Winnetka", 34.212, -118.571],
      ["West Hills", 34.203, -118.644],
      ["Granada Hills", 34.28, -118.502],
      ["Crescenta Valley", 34.232, -118.243],
      ["Inglewood", 33.962, -118.353],
      ["Hawthorne", 33.916, -118.352],
      ["El Segundo", 33.919, -118.416],
      ["Manhattan Beach", 33.885, -118.411],
      ["Hermosa Beach", 33.862, -118.4],
      ["Redondo Beach", 33.849, -118.388],
      ["Rancho Palos Verdes", 33.744, -118.387],
      ["Torrance", 33.836, -118.341],
      ["Long Beach", 33.77, -118.194],
      ["Carson", 33.831, -118.282],
      ["Gardena", 33.888, -118.309],
      ["Lawndale", 33.887, -118.353],
    ]),
  },
];

export const defaultAreaRegionId = serviceAreas[0]?.id ?? "san-diego";

export function areaMapSrc(lat: number, lng: number, zoom: number) {
  const params = new URLSearchParams({
    ll: `${lat},${lng}`,
    z: String(zoom),
    t: "m",
    output: "embed",
    hl: "en",
    iwloc: "",
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}

export function areaMapsLink(query: string) {
  const params = new URLSearchParams({
    api: "1",
    query,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}
