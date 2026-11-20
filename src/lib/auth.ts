
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.DB_URL as string);
const db = client.db("rental-platform");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  trustedOrigins: ["http://localhost:5000"],
  secret: process.env.BETTER_AUTH_SECRET,

  user: {
    additionalFields: {
      role: {
        type: ["admin", "owner", "customer"],
        required: true,
        input: false,
        defaultValue: "customer",
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
