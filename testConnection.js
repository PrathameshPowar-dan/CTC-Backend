const knex = require('./knexConnection');

knex.raw('SELECT 1+1 AS result')
    .then(() => {
        console.log('✅ MySQL connection successful!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MySQL connection failed:', err);
        process.exit(1);
    });
