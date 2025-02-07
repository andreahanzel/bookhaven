import swaggerAutogen from 'swagger-autogen'; //Swagger documentation generator
import dotenv from 'dotenv'; //Load environment variables

dotenv.config(); //Load environment variables

const doc = {
  info: {
    title: 'BookHaven API',
    description: 'API for managing book store'
  },
  host: process.env.HOST || 'bookhaven-api-npvi.onrender.com',
  basePath: '/',
  schemes: ['http', 'https']
}; //Swagger documentation configuration

const outputFile = './swagger_output.json'; //Output file for Swagger documentation
const endpointsFiles = [
  './routes/books.js', //Routes to be documented - Books
  './routes/users.js', //Routes to be documented - Users
  './routes/index.js'
];

// Generate Swagger documentation
swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
  console.log('Swagger documentation generated successfully!');
  await import('./server.js'); //Import the server file
});
