const cspHeader = `
  default-src 'self';
  connect-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  img-src 'self' blob: data:;
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  frame-src;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer-when-downgrade",
  },
  {
    key: "X-Frame-Options",
    value: "deny",
  },
  {
    key: "X-Download-Options",
    value: "noopen",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
