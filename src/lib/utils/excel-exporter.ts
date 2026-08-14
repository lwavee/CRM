import { LeadRecord } from '@/lib/data/mock-db';
import { InsuranceCompany, getCompanyDecisionMakers } from '@/lib/data/insurance-db';
import { WebDevClientLead } from '@/lib/data/webdev-db';

/**
 * Export Website Development Client Prospects to Microsoft Excel compatible CSV file.
 */
export function exportWebDevClientsToExcel(clients: WebDevClientLead[], fileName?: string) {
  if (!clients || clients.length === 0) {
    alert('No website development client data available to export.');
    return;
  }

  const defaultFileName = `Website_Development_Clients_${new Date().toISOString().slice(0, 10)}.csv`;

  const headers = [
    'Company Name',
    'Domain',
    'Website URL',
    'Email Address',
    'Phone Number',
    'Country',
    'State / City',
    'Industry',
    'Project Type',
    'Estimated Budget ($)',
    'Urgency Level',
    'Performance Score',
    'Mobile Score',
    'SEO Score',
    'Top Tech Bottleneck',
    'Decision Maker Name',
    'Decision Maker Title',
    'Decision Maker Email',
    'Hiring Signal / Source',
    'Status',
  ];

  const rows = clients.map((c) => [
    escapeCsvCell(c.name),
    escapeCsvCell(c.domain),
    escapeCsvCell(c.website),
    escapeCsvCell(c.email),
    escapeCsvCell(c.phone),
    escapeCsvCell(c.country),
    escapeCsvCell(`${c.city}, ${c.state}`),
    escapeCsvCell(c.industry),
    escapeCsvCell(c.projectType),
    escapeCsvCell(`$${c.estimatedBudget.toLocaleString()}`),
    escapeCsvCell(c.urgency),
    escapeCsvCell(`${c.audit.performanceScore}/100`),
    escapeCsvCell(`${c.audit.mobileScore}/100`),
    escapeCsvCell(`${c.audit.seoScore}/100`),
    escapeCsvCell(c.audit.topIssue),
    escapeCsvCell(c.decisionMaker.name),
    escapeCsvCell(c.decisionMaker.title),
    escapeCsvCell(c.decisionMaker.email),
    escapeCsvCell(c.buyingSignal),
    escapeCsvCell(c.status),
  ]);

  downloadCsvAsExcel(headers, rows, fileName || defaultFileName);
}


/**
 * Utility to export lead records to Microsoft Excel compatible CSV/XLSX file.
 * UTF-8 BOM (\uFEFF) ensures special characters, phone numbers, and formatting open perfectly in Microsoft Excel.
 */
export function exportLeadsToExcel(leads: LeadRecord[], fileName = 'CRM_Leads_Database.csv') {
  if (!leads || leads.length === 0) {
    alert('No lead data available to export.');
    return;
  }

  const headers = [
    'Company Name',
    'Email Address',
    'Website URL',
    'Phone Number',
    'Requirement',
    'Industry',
    'Country',
    'State / City',
    'Source / Hiring Signal',
    'Estimated Deal Value ($)',
    'Opportunity Score',
  ];

  const rows = leads.map((lead) => {
    const email = lead.email || lead.decisionMakers?.[0]?.email || 'N/A';
    const phone = lead.phone || lead.decisionMakers?.[0]?.phone || 'N/A';
    const requirement = lead.requirement || lead.aiSummary?.primaryPitchReason || lead.recommendedService;
    const signal = lead.buyingSignals?.[0]?.title || 'Direct Web Discovered';
    const location = `${lead.city || ''}${lead.city && lead.state ? ', ' : ''}${lead.state || ''}`;

    return [
      escapeCsvCell(lead.name),
      escapeCsvCell(email),
      escapeCsvCell(lead.website),
      escapeCsvCell(phone),
      escapeCsvCell(requirement),
      escapeCsvCell(lead.industry),
      escapeCsvCell(lead.country),
      escapeCsvCell(location),
      escapeCsvCell(signal),
      escapeCsvCell(`$${lead.estimatedDealValue.toLocaleString()}`),
      escapeCsvCell(`${lead.opportunityScore}/100`),
    ];
  });

  downloadCsvAsExcel(headers, rows, fileName);
}

/**
 * Export Insurance Companies Registry to Microsoft Excel compatible file.
 */
export function exportInsuranceCompaniesToExcel(companies: InsuranceCompany[], fileName?: string) {
  if (!companies || companies.length === 0) {
    alert('No insurance company data available to export.');
    return;
  }

  const defaultFileName = `Insurance_Companies_Database_${new Date().toISOString().slice(0, 10)}.csv`;

  const headers = [
    'Company Name',
    'Registered Domain',
    'Support Email',
    'Support Phone',
    'CEO / Founder Name',
    'CEO Title',
    'CEO Direct Email',
    'CEO Direct Phone',
    'CEO LinkedIn Profile',
    'Marketing Manager Name',
    'Marketing Manager Title',
    'Marketing Manager Email',
    'Marketing Manager Phone',
    'Marketing Manager LinkedIn',
    'Website URL',
    'Google Maps Direct URL',
    'Country',
    'State / Province',
    'City',
    'Category / Line',
    'Founded Year',
    'Employees',
    'Annual Revenue',
    'Google Rating',
    'Google Reviews Count',
    'Verification Status',
    'About Provider',
  ];

  const rows = companies.map((c) => {
    const displayDomain = c.domain || (c.website ? c.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '') : '');
    const mapsUrl = c.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + ' ' + c.city + ' ' + c.state)}`;
    const execs = getCompanyDecisionMakers(c);
    const ceo = execs[0] || { fullName: '', jobTitle: '', email: '', phone: '', linkedInUrl: '' };
    const mkt = execs[1] || { fullName: '', jobTitle: '', email: '', phone: '', linkedInUrl: '' };

    return [
      escapeCsvCell(c.name),
      escapeCsvCell(displayDomain),
      escapeCsvCell(c.email),
      escapeCsvCell(c.phone),
      escapeCsvCell(ceo.fullName),
      escapeCsvCell(ceo.jobTitle),
      escapeCsvCell(ceo.email),
      escapeCsvCell(ceo.phone),
      escapeCsvCell(ceo.linkedInUrl || ''),
      escapeCsvCell(mkt.fullName),
      escapeCsvCell(mkt.jobTitle),
      escapeCsvCell(mkt.email),
      escapeCsvCell(mkt.phone),
      escapeCsvCell(mkt.linkedInUrl || ''),
      escapeCsvCell(c.website),
      escapeCsvCell(mapsUrl),
      escapeCsvCell(c.country),
      escapeCsvCell(c.state),
      escapeCsvCell(c.city),
      escapeCsvCell(c.category),
      escapeCsvCell(c.foundedYear),
      escapeCsvCell(c.employeeCount),
      escapeCsvCell(c.revenue),
      escapeCsvCell(c.rating),
      escapeCsvCell(c.googleReviewsCount || 0),
      escapeCsvCell(c.status),
      escapeCsvCell(c.about),
    ];
  });

  downloadCsvAsExcel(headers, rows, fileName || defaultFileName);
}

function downloadCsvAsExcel(headers: string[], rows: string[][], fileName: string) {
  // Prepend UTF-8 BOM \uFEFF so MS Excel auto-detects UTF-8 character encoding
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvCell(text: string | number | null | undefined): string {
  if (text === undefined || text === null) return '""';
  const stringValue = String(text).replace(/"/g, '""');
  return `"${stringValue}"`;
}
