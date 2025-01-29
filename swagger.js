import swaggerAutogen from 'swagger-autogen'; //Swagger documentation generator
import dotenv from 'dotenv'; //Load environment variables
dotenv.config(); //Load environment variables

const doc = {
  info: {
    title: 'BookHaven API',
    description: 'API for managing book store'
  },
  host: process.env.HOST || 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https']
}; //Swagger documentation configuration

const outputFile = './swagger_output.json'; //Output file for Swagger documentation
const endpointsFiles = ['./routes/orders.js', './routes/books.js', './routes/reviews.js', './routes/users.js' ]; // Files to include in Swagger documentation

//Generate Swagger documentation

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
  // Import server.js dynamically
  await import('./server.js');
});
