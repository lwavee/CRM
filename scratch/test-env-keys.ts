// Environment API Keys Live Diagnostic Test Script (Native Node)
import fs from 'fs';
import path from 'path';

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env'));
loadEnvFile(path.resolve(process.cwd(), '.env.local'));

async function diagnoseApiKeys() {
  console.log('====================================================');
  console.log('   ELITEOPS API KEYS DIAGNOSTIC & ACCURACY REPORT   ');
  console.log('====================================================\n');

  // 1. Test OpenAI API Key
  const openaiKey = process.env.OPENAI_API_KEY;
  console.log('1. OPENAI_API_KEY:');
  console.log(`   Key preview: "${openaiKey ? openaiKey.slice(0, 15) + '...' : 'NONE'}"`);
  if (!openaiKey) {
    console.log('   ❌ NOT CONFIGURED IN ENV');
  } else {
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${openaiKey}` },
      });
      if (res.ok) {
        console.log('   ✅ STATUS: ACTIVE & WORKING PERFECTLY (HTTP 200 OK)');
      } else {
        const errData = await res.json().catch(() => ({}));
        console.log(`   ❌ MISTAKE / ERROR (HTTP ${res.status}): ${errData.error?.message || res.statusText}`);
      }
    } catch (e: any) {
      console.log(`   ❌ NETWORK ERROR: ${e.message}`);
    }
  }
  console.log('');

  // 2. Test Hunter.io API Key
  const hunterKey = process.env.HUNTER_API_KEY;
  console.log('2. HUNTER_API_KEY:');
  console.log(`   Key preview: "${hunterKey ? hunterKey.slice(0, 10) + '...' : 'NONE'}"`);
  if (!hunterKey) {
    console.log('   ❌ NOT CONFIGURED IN ENV');
  } else {
    try {
      const res = await fetch(`https://api.hunter.io/v2/account?api_key=${hunterKey}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.data) {
        console.log(`   ✅ STATUS: ACTIVE & WORKING PERFECTLY (HTTP 200 OK) - Owner: ${data.data.first_name || ''} ${data.data.last_name || ''}, Search calls remaining: ${data.data.calls?.left ?? 'N/A'}`);
      } else {
        console.log(`   ❌ MISTAKE / ERROR (HTTP ${res.status}): ${data.errors?.[0]?.details || data.message || 'Invalid API Key'}`);
      }
    } catch (e: any) {
      console.log(`   ❌ NETWORK ERROR: ${e.message}`);
    }
  }
  console.log('');

  // 3. Test Apollo.io API Key
  const apolloKey = process.env.APOLLO_API_KEY;
  console.log('3. APOLLO_API_KEY:');
  console.log(`   Key preview: "${apolloKey ? apolloKey.slice(0, 8) + '...' : 'NONE'}"`);
  if (!apolloKey) {
    console.log('   ❌ NOT CONFIGURED IN ENV');
  } else {
    try {
      const res = await fetch('https://api.apollo.io/v1/organizations/enrich?domain=google.com', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apolloKey,
        },
      });
      if (res.ok) {
        console.log('   ✅ STATUS: ACTIVE & WORKING PERFECTLY (HTTP 200 OK)');
      } else {
        const data = await res.json().catch(() => ({}));
        console.log(`   ❌ MISTAKE / ERROR (HTTP ${res.status}): ${data.error || data.message || 'Unauthorized / Invalid Key'}`);
      }
    } catch (e: any) {
      console.log(`   ❌ NETWORK ERROR: ${e.message}`);
    }
  }
  console.log('');

  // 4. Test Google Custom Search API Key & CX
  const googleSearchKey = process.env.GOOGLE_SEARCH_API_KEY;
  const googleSearchCx = process.env.GOOGLE_SEARCH_CX;
  console.log('4. GOOGLE_SEARCH_API_KEY & GOOGLE_SEARCH_CX:');
  console.log(`   Key preview: "${googleSearchKey ? googleSearchKey.slice(0, 10) + '...' : 'NONE'}"`);
  console.log(`   CX:          "${googleSearchCx || 'NONE'}"`);
  if (!googleSearchKey || !googleSearchCx) {
    console.log('   ❌ MISSING KEY OR CX');
  } else {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${googleSearchKey}&cx=${googleSearchCx}&q=insurance`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        console.log('   ✅ STATUS: ACTIVE & WORKING PERFECTLY (HTTP 200 OK)');
      } else {
        console.log(`   ❌ MISTAKE / ERROR (HTTP ${res.status}): ${data.error?.message || 'Google Custom Search Failed'}`);
      }
    } catch (e: any) {
      console.log(`   ❌ NETWORK ERROR: ${e.message}`);
    }
  }
  console.log('');

  // 5. Test Google Maps API Key
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log('5. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:');
  console.log(`   Key value: "${mapsKey || ''}"`);
  if (!mapsKey) {
    console.log('   ❌ NOT CONFIGURED IN ENV');
  } else if (mapsKey.includes('706c1e83-30ea-4951-96cb-b45465d4c45c')) {
    console.log('   ❌ CRITICAL MISTAKE DETECTED: "706c1e83-30ea-4951-96cb-b45465d4c45c" is NOT a Google Maps API Key! That is a UUID format (Supabase/Internal ID). Google API keys always start with "AIzaSy...".');
  } else {
    try {
      const legacyUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=insurance+boise&key=${mapsKey}`;
      const res = await fetch(legacyUrl);
      const data = await res.json().catch(() => ({}));
      if (data.status === 'OK') {
        console.log('   ✅ STATUS: ACTIVE & WORKING PERFECTLY (HTTP 200 OK)');
      } else {
        console.log(`   ❌ MISTAKE / ERROR (${data.status}): ${data.error_message || 'Places API request denied'}`);
      }
    } catch (e: any) {
      console.log(`   ❌ NETWORK ERROR: ${e.message}`);
    }
  }
  console.log('');

  // 6. Test Database Connection URL
  const dbUrl = process.env.DATABASE_URL;
  console.log('6. DATABASE_URL:');
  console.log(`   Value: "${dbUrl || ''}"`);
  if (!dbUrl || dbUrl.includes('localhost:5432')) {
    console.log('   ℹ️ INFO: Local PostgreSQL connection string. Ensure local PostgreSQL server is running on port 5432 or update to Supabase connection string.');
  }
  console.log('\n====================================================\n');
}

diagnoseApiKeys();
