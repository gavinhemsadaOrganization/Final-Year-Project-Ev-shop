import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ev-shop API Documentation",
      version: "1.0.0",
      description: "API documentation for the Ev-shop application",
      contact: {
        name: "API Support",
        email: "support@yourapi.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development server",
      },
      //   {
      //     url: 'https://api.yourapp.com/api/v1',
      //     description: 'Production server',
      //   },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin", "seller"],
              example: "user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CartItemDTO: {
          type: "object",
          required: ["user_id", "listing_id", "quantity"],
          properties: {
            user_id: {
              type: "string",
              description: "ID of the user who owns the cart.",
              example: "60d0fe4f5e3e3e0015a8b456",
            },
            listing_id: {
              type: "string",
              description: "ID of the listing (product) to add to the cart.",
              example: "60d0fe4f5e3e3e0015a8b457",
            },
            quantity: {
              type: "number",
              description: "Quantity of the listing to add.",
              example: 1,
            },
          },
        },
        UpdateCartItemDTO: {
          type: "object",
          required: ["quantity"],
          properties: {
            quantity: {
              type: "number",
              description: "New quantity for the cart item.",
              example: 2,
            },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "60d0fe4f5e3e3e0015a8b458",
            },
            cart_id: {
              type: "string",
              example: "60d0fe4f5e3e3e0015a8b459",
            },
            listing_id: {
              type: "string",
              example: "60d0fe4f5e3e3e0015a8b457",
            },
            quantity: {
              type: "number",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CartResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            cart: {
              type: "object",
              properties: {
                _id: { type: "string", example: "60d0fe4f5e3e3e0015a8b459" },
                user_id: {
                  type: "string",
                  example: "60d0fe4f5e3e3e0015a8b456",
                },
                items: {
                  type: "array",
                  items: { $ref: "#/components/schemas/CartItem" },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.router.ts", "./src/modules/**/*.controller.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
