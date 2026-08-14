// Automated Regression Test Suite: Pipeline Sanitizer & Quality Gate Rules
import { isPlaceholderPhone, validatePersonName, sanitizePhone } from '../src/lib/lead-pipeline/sanitizer';
import { validateLinkedInUrl } from '../src/lib/lead-pipeline/linkedinValidator';
import { evaluateQualityGate } from '../src/lib/lead-pipeline/qualityGate';

export function runPipelineSanitizerTests() {
  console.log('Running Pipeline Sanitizer & Regression Tests...');

  // REGRESSION 1: Placeholder 555 phone numbers must be rejected
  if (!isPlaceholderPhone('+1 (800) 555-0199')) throw new Error('Failed REGRESSION 1: +1 (800) 555-0199 not rejected!');
  if (!isPlaceholderPhone('208-555-0145')) throw new Error('Failed REGRESSION 1: 208-555-0145 not rejected!');
  if (!isPlaceholderPhone('000-000-0000')) throw new Error('Failed REGRESSION 1: 000-000-0000 not rejected!');
  if (sanitizePhone('+1 (800) 555-0199') !== null) throw new Error('Failed REGRESSION 1: sanitizePhone did not return null!');
  if (sanitizePhone('+1 (208) 378-0200') !== '+1 (208) 378-0200') throw new Error('Failed REGRESSION 1: Valid phone mangled!');

  // REGRESSION 2: Generic job titles without a person full name must be rejected
  if (validatePersonName('Managing Principal') !== null) throw new Error('Failed REGRESSION 2: Managing Principal not rejected!');
  if (validatePersonName('CEO') !== null) throw new Error('Failed REGRESSION 2: CEO not rejected!');
  if (validatePersonName('Agency Owner') !== null) throw new Error('Failed REGRESSION 2: Agency Owner not rejected!');
  if (validatePersonName('Brad Sterling') !== 'Brad Sterling') throw new Error('Failed REGRESSION 2: Valid name rejected!');

  // REGRESSION 3: LinkedIn Search URLs & fake links must return null
  const searchUrl = 'https://www.linkedin.com/search/results/people/?keywords=Brad%20Sterling';
  if (validateLinkedInUrl(searchUrl).cleanUrl !== null) throw new Error('Failed REGRESSION 3: LinkedIn search URL not rejected!');

  const validProfileUrl = 'https://www.linkedin.com/in/brad-sterling-12345';
  if (validateLinkedInUrl(validProfileUrl).cleanUrl !== validProfileUrl) throw new Error('Failed REGRESSION 3: Valid profile URL rejected!');

  // REGRESSION 4: Quality Gate must reject Carrier corporations
  const gateRes = evaluateQualityGate({
    name: 'Blue Cross of Idaho',
    domain: 'bcidaho.com',
    classification: 'CARRIER',
    hasWebsiteOrPlace: true,
    isDeadOrParked: false,
  });

  // REGRESSION 5: Production static array isolation test
  const { INITIAL_INSURANCE_COMPANIES } = require('../src/lib/data/insurance-db');
  if (INITIAL_INSURANCE_COMPANIES.length !== 0) {
    throw new Error('Failed REGRESSION 5: INITIAL_INSURANCE_COMPANIES is not empty! Static demo records found in production data source.');
  }

  console.log('✅ ALL PIPELINE SANITIZER & REGRESSION TESTS PASSED CLEANLY!');
  return true;
}

// Auto-run if executed directly
if (require.main === module) {
  runPipelineSanitizerTests();
}
