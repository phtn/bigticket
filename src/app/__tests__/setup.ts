import { beforeAll } from "bun:test";

// Mock environment variables needed for tests
beforeAll(() => {
  // process.env.NODE_ENV = "test";
  process.env.SKIP_ENV_VALIDATION = "1";
  
  // Add mock values for required env variables
  process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.dev";
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client-id";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY = "test-api-key";
  
  // Server-side env vars
  process.env.CONVEX_DEPLOYMENT = "test";
  process.env.PEXELS_API = "test-pexels-api";
  process.env.SMTP_HOST = "test-smtp-host";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_SECURE = "false";
  process.env.SMTP_USER = "test@example.com";
  process.env.SMTP_PASSWORD = "test-password";
  process.env.SMTP_FROM_EMAIL = "test@example.com";
  process.env.FIREBASE_STORAGE_BUCKET = "test-bucket";
  process.env.FIREBASE_STORAGE_TOKEN = "test-token";
  process.env.PAYMONGO_PK = "test-pk";
  process.env.PAYMONGO_SK = "test-sk";
  process.env.PAYMONGO_WHSK = "test-whsk";
  process.env.CC_API_KEY = "test-cc-api-key";
  process.env.WC_PROJECT_ID = "test-wc-project-id";
});
