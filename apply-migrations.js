#!/usr/bin/env node

/**
 * Script to apply Supabase migrations
 * 
 * Usage:
 *   SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node apply-migrations.js
 * 
 * Or set in .env file and use dotenv
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables');
  console.error('');
  console.error('Please set:');
  console.error('  - SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('You can find these in your Supabase dashboard:');
  console.error('  1. Go to Settings > API');
  console.error('  2. Copy "Project URL" for SUPABASE_URL');
  console.error('  3. Copy "service_role" key (secret) for SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Then run:');
  console.error('  SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node apply-migrations.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration(filePath, description) {
  try {
    const sql = readFileSync(filePath, 'utf-8');
    // Extract just the SQL statement (remove comments)
    const sqlStatement = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('/*') && !line.trim().startsWith('*') && !line.trim().startsWith('*/') && line.trim() !== '')
      .join('\n')
      .trim();

    console.log(`\n📝 Applying: ${description}`);
    console.log(`   File: ${filePath}`);
    
    const { error } = await supabase.rpc('exec_sql', { sql: sqlStatement });
    
    if (error) {
      // Try direct query if RPC doesn't work
      const { error: directError } = await supabase
        .from('_migrations')
        .select('*')
        .limit(1);
      
      // If that works, try executing via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql: sqlStatement })
      });

      if (!response.ok) {
        // Last resort: try direct SQL execution
        console.log('   ⚠️  Note: Direct SQL execution via JS client is limited.');
        console.log('   Please run this SQL manually in Supabase SQL Editor:');
        console.log(`\n${sqlStatement}\n`);
        return false;
      }
    }
    
    console.log(`   ✅ Success!`);
    return true;
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    console.log('   Please run this SQL manually in Supabase SQL Editor:');
    const sql = readFileSync(filePath, 'utf-8');
    const sqlStatement = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('/*') && !line.trim().startsWith('*') && !line.trim().startsWith('*/') && line.trim() !== '')
      .join('\n')
      .trim();
    console.log(`\n${sqlStatement}\n`);
    return false;
  }
}

async function main() {
  console.log('🚀 Applying Supabase Migrations\n');
  console.log(`Project URL: ${supabaseUrl}\n`);

  const migrations = [
    {
      file: join(__dirname, 'supabase/migrations/20251122175410_allow_insert_tools.sql'),
      description: 'Allow INSERT operations on tools table'
    },
    {
      file: join(__dirname, 'supabase/migrations/20251122180000_allow_delete_tools.sql'),
      description: 'Allow DELETE operations on tools table'
    }
  ];

  let allSuccess = true;

  for (const migration of migrations) {
    const success = await applyMigration(migration.file, migration.description);
    if (!success) {
      allSuccess = false;
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allSuccess) {
    console.log('✅ All migrations applied successfully!');
  } else {
    console.log('⚠️  Some migrations need to be applied manually.');
    console.log('Please check the SQL statements above and run them in Supabase SQL Editor.');
  }
  console.log('='.repeat(50));
}

main().catch(console.error);

