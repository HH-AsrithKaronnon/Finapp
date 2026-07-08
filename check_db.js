import pg from 'pg';

const connectionString = `postgresql://postgres.viefdnbijxsasfdjpusb:Zb1HvBIAj1b9XnXP@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`;

async function main() {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    const accs = await client.query('SELECT * FROM accounts');
    console.log('--- Accounts ---');
    console.log(JSON.stringify(accs.rows, null, 2));

    const settings = await client.query('SELECT * FROM user_settings');
    console.log('--- User Settings ---');
    console.log(JSON.stringify(settings.rows, null, 2));

    const txs = await client.query('SELECT * FROM transactions');
    console.log('--- Transactions ---');
    console.log(JSON.stringify(txs.rows, null, 2));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();
