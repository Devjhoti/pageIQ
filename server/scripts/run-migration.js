const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  // Check if columns already exist
  const { data: test, error: testErr } = await supabase
    .from('reports')
    .select('analysis_type')
    .limit(1);

  if (testErr && (testErr.message || '').includes('column')) {
    console.log('Column analysis_type does not exist. Running migration...');

    const sql = `
ALTER TABLE analysis_queue ADD COLUMN IF NOT EXISTS analysis_type text DEFAULT 'general' CHECK (analysis_type IN ('general', 'comprehensive'));
ALTER TABLE reports ADD COLUMN IF NOT EXISTS analysis_type text DEFAULT 'general' CHECK (analysis_type IN ('general', 'comprehensive'));
ALTER TABLE reports ADD COLUMN IF NOT EXISTS fb_access_token text;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS fb_page_id text;
`;

    try {
      const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/rpc/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({ query: sql }),
      });
      console.log('RPC endpoint status:', response.status);
      const text = await response.text();
      console.log('RPC response:', text);
    } catch (e) {
      console.log('RPC failed:', e.message);
    }

    try {
      const response = await fetch(process.env.SUPABASE_URL + '/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({ query: sql }),
      });
      console.log('/sql endpoint status:', response.status);
      const text = await response.text();
      console.log('/sql response:', text);
    } catch (e) {
      console.log('/sql endpoint failed:', e.message);
    }

  } else if (test && !testErr) {
    console.log('Column analysis_type already exists. Migration already applied.');
  } else {
    console.log('Error checking columns:', testErr?.message);
  }
}

run().catch(console.error);
