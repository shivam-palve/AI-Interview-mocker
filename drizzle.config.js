/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://mocker1_owner:SFv7PYzA3sWo@ep-sweet-resonance-a5ot1sr8.us-east-2.aws.neon.tech/mocker1?sslmode=require',
  }
};
