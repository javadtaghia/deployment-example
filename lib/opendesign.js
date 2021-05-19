import { createSdk } from "@opendesign/sdk";

const sdk = createSdk({
  apiRoot: process.env.OD_API_ENDPOINT,
  token: process.env.OD_API_TOKEN,
  cached: false,
  console: { level: "info" },
  workingDirectory: "/tmp",
});

export default sdk;
