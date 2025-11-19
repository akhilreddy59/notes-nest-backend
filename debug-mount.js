const express = require('express');
try {
  const r = require('./routes/documents');
  console.log('router type:', typeof r);
  const app = express();
  console.log('About to mount router...');
  app.use('/api/notes', r);
  console.log('Mounted successfully.');
} catch (err) {
  console.error('Error mounting router:', err && err.stack ? err.stack : err);
  process.exit(1);
}
console.log('Done');
