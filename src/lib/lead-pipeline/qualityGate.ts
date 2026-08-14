// Pipeline Component: Hard Quality Gate & Lead Classification Filter

import { AgencyClassificationType } from '../providers/openai';

export interface QualityGateResult {
  passed: boolean;
  reason?: string;
}

export function evaluateQualityGate(candidate: {
  name: string;
  domain: string;
  classification: AgencyClassificationType;
  hasWebsiteOrPlace: boolean;
  isDeadOrParked?: boolean;
}): QualityGateResult {
  // Rule 1: Business name required
  if (!candidate.name || candidate.name.trim().length < 3) {
    return { passed: false, reason: 'Invalid or missing business name' };
  }

  // Rule 2: Reject non-agency classifications
  if (
    candidate.classification === 'CARRIER' ||
    candidate.classification === 'ASSOCIATION' ||
    candidate.classification === 'GOVERNMENT' ||
    candidate.classification === 'DIRECTORY'
  ) {
    return {
      passed: false,
      reason: `Rejected classification type: ${candidate.classification} (Target is Independent Agency/Brokerage)`,
    };
  }

  // Rule 3: Domain or Google Place required
  if (!candidate.hasWebsiteOrPlace) {
    return { passed: false, reason: 'Lacks valid domain website or Google Maps business listing' };
  }

  // Rule 4: Reject dead or parked domains
  if (candidate.isDeadOrParked) {
    return { passed: false, reason: 'Domain is dead, parked, or inaccessible' };
  }

  return { passed: true };
}
