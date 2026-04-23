process.env.NODE_ENV = "test";
process.env.PORT = "4001";
process.env.JWT_SECRET = "test-super-secret-key";
process.env.JWT_EXPIRES_IN = "1d";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/testdb?schema=public";
