const nextConfig = {
    async rewrites() {
      console.log("Next.js config loaded");
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;
  