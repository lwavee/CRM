// Provider Adapter: Google Places API (New v1 Endpoint Only)

export interface GooglePlaceResult {
  placeId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  googleMapsUrl?: string;
  types?: string[];
}

export async function discoverGooglePlaces(
  query: string,
  location: string,
  country: string = 'USA',
  limit: number = 20
): Promise<{ success: boolean; places: GooglePlaceResult[]; error?: string }> {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_SEARCH_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      places: [],
      error: 'GOOGLE_MAPS_API_KEY is not configured in server environment.',
    };
  }

  const searchQuery = `${query} in ${location} ${country}`;

  // STAGE: Google Places API (New) POST https://places.googleapis.com/v1/places:searchText
  try {
    const placesNewUrl = 'https://places.googleapis.com/v1/places:searchText';
    const res = await fetch(placesNewUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.rating,places.userRatingCount,places.businessStatus,places.types',
      },
      body: JSON.stringify({ textQuery: searchQuery }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        places: [],
        error: `Google Places API (New) returned HTTP ${res.status}: ${errData.error?.message || res.statusText}`,
      };
    }

    const data = await res.json();
    const rawPlaces = data.places || [];

    if (rawPlaces.length === 0) {
      return {
        success: true,
        places: [],
      };
    }

    const places: GooglePlaceResult[] = rawPlaces.slice(0, limit).map((p: any) => {
      const formattedAddr = p.formattedAddress || `${p.displayName?.text || query}, ${location}`;
      const addressParts = formattedAddr.split(',').map((s: string) => s.trim());
      const city = addressParts.length > 2 ? addressParts[addressParts.length - 3] : location;
      const statePart = addressParts.length > 1 ? addressParts[addressParts.length - 2] : location;

      return {
        placeId: p.id || `place_${Math.random().toString(36).substr(2, 6)}`,
        name: p.displayName?.text || query,
        address: formattedAddr,
        city: city || location,
        state: statePart || location,
        country: country,
        phone: p.nationalPhoneNumber || undefined,
        website: p.websiteUri || undefined,
        rating: p.rating || undefined,
        userRatingsTotal: p.userRatingCount || undefined,
        googleMapsUrl: p.googleMapsUri || (p.id ? `https://www.google.com/maps/place/?q=place_id:${p.id}` : undefined),
        types: p.types || [],
      };
    });

    return {
      success: true,
      places,
    };
  } catch (err: any) {
    return {
      success: false,
      places: [],
      error: `Google Places API (New) network error: ${err.message || String(err)}`,
    };
  }
}
