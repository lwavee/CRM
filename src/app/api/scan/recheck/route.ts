import { NextResponse } from 'next/server';
import { verifyHunterEmail, searchHunterDomain } from '@/lib/providers/hunter';
import { validateWebsite } from '@/lib/lead-pipeline/websiteValidator';
import { validateLinkedInUrl } from '@/lib/lead-pipeline/linkedinValidator';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      const rawText = await request.text();
      if (rawText && rawText.trim().length > 0) {
        body = JSON.parse(rawText);
      }
    } catch (e) {
      body = {};
    }

    const company = body.company;

    if (!company || (!company.domain && !company.website)) {
      return NextResponse.json(
        { success: false, error: 'Invalid company payload' },
        { status: 400 }
      );
    }

    const domain = company.domain || company.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    const webVal = await validateWebsite(company.website || `https://${domain}`);

    if (webVal.isDeadOrParked) {
      return NextResponse.json({
        success: false,
        verified: false,
        reason: 'Domain website is dead, parked, or inaccessible.',
      });
    }

    // Re-verify email
    let updatedEmail = company.email;
    let emailStatus = 'UNVERIFIED';

    if (company.email && company.email.includes('@')) {
      const emailVer = await verifyHunterEmail(company.email);
      if (emailVer.status === 'invalid' || emailVer.status === 'disposable') {
        updatedEmail = null; // Set invalid email to null as required
        emailStatus = 'INVALID';
      } else {
        emailStatus = emailVer.status.toUpperCase();
      }
    } else {
      const hunterRes = await searchHunterDomain(domain);
      if (hunterRes.success && hunterRes.contacts.length > 0) {
        updatedEmail = hunterRes.contacts[0].email;
        emailStatus = 'VALID';
      }
    }

    // Re-validate LinkedIn profiles
    const updatedDecisionMakers = (company.decisionMakers || []).map((dm: any) => {
      const val = validateLinkedInUrl(dm.linkedInUrl);
      return {
        ...dm,
        linkedInUrl: val.cleanUrl, // Will be null if missing or guessed URL
      };
    });

    const updatedCompany = {
      ...company,
      email: updatedEmail,
      emailStatus,
      decisionMakers: updatedDecisionMakers,
      lastVerifiedAt: new Date().toISOString().split('T')[0],
      verificationStatus: updatedEmail ? 'VERIFIED' : 'NEEDS_REVIEW',
    };

    return NextResponse.json({
      success: true,
      verified: true,
      company: updatedCompany,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Re-check exception: ${err.message || String(err)}` },
      { status: 500 }
    );
  }
}
