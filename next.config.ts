 

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Fix the cross-origin warning
  allowedDevOrigins: ['192.168.56.1'],
};

module.exports = nextConfig;