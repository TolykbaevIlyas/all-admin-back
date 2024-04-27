const swaggerOptions = {
    swaggerDefinition: {
      allAdmin: '3.0.0',
      info: {
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000/',
        },
      ],
    },
    apis: ['./api/**/*.ts'],
  };
  
  module.exports = swaggerOptions;
  