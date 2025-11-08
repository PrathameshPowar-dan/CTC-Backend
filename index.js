require('dotenv').config();
const express = require('express')
const cors = require('cors');
const routes = require("./src/routes");
const { notFound } = require('./src/utils/errors');
const errorHandler = require('./src/utils/errorHandler');
const cookieParser = require('cookie-parser');
const credentials = require('./src/middleware/credentials');
const corsOptions = require('./src/config/corsOptions');

const app = express();

app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.json({ limit: '500mb' }));

//middleware for cookies
app.use(cookieParser());


app.use("/api", routes);

// Handle unknown routes
app.all(/.*/, (req, res, next) => next(notFound(`Cannot find ${req.originalUrl}`)));


// Error middleware
app.use(errorHandler);

let port = process.env.PORT || 8001

app.listen(port, () => {
  console.log(`Backend running ${port}`)
})
