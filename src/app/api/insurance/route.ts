import { NextResponse } from 'next/server';
import { INITIAL_INSURANCE_COMPANIES } from '@/lib/data/insurance-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const country = searchParams.get('country') || '';
    const category = searchParams.get('category') || '';

    let filtered = [...INITIAL_INSURANCE_COMPANIES];

    if (country) {
      filtered = filtered.filter(
        (c) => c.country.toLowerCase() === country.toLowerCase()
      );
    }

    if (category) {
      filtered = filtered.filter(
        (c) => c.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          (c.email && c.email.toLowerCase().includes(search)) ||
          (c.website && c.website.toLowerCase().includes(search)) ||
          (c.about && c.about.toLowerCase().includes(search)) ||
          (c.city && c.city.toLowerCase().includes(search)) ||
          (c.state && c.state.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      companies: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load insurance companies' },
      { status: 500 }
    );
  }
}
