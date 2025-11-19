try {
  console.log('Requiring documents route...');
  const r = require('./routes/documents');
  console.log('documents route required. type:', typeof r);
} catch (err) {
  console.error('Error while requiring routes/documents:', err && err.stack ? err.stack : err);
  process.exit(1);
}
console.log('Done');
