/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:0Ao5ZxOXDfba@ep-calm-bread-a5s7bkxy.us-east-2.aws.neon.tech/AI-Interview-Mocker?sslmode=require',
    }
  };