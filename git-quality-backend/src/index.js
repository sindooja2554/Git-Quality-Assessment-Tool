require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const route = require('./routes/routes');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Required environment variables are missing:');
  if (!process.env.SUPABASE_URL) console.error('- SUPABASE_URL is not set');
  if (!process.env.SUPABASE_ANON_KEY) console.error('- SUPABASE_ANON_KEY is not set');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/', route);

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'Git Repository Quality Assessment API' });
});

// Test route to verify Supabase connection
app.get('/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    res.json({
      message: 'Successfully connected to Supabase',
      data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error connecting to Supabase',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Supabase URL configured: ${process.env.SUPABASE_URL ? 'Yes' : 'No'}`);
});