/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/law/:lawId/toc',
        destination: '/law/[lawId]/toc',
      },
      {
        source: '/law/:lawId/article/:articleNo',
        destination: '/law/[lawId]/article/[articleNo]',
      },
      {
        source: '/law/:lawId/all',
        destination: '/law/[lawId]/all',
      },
      {
        source: '/law/:lawId/search',
        destination: '/law/[lawId]/search',
      },
      {
        source: '/law/:lawId/lookup',
        destination: '/law/[lawId]/lookup',
      },
      {
        source: '/law/:lawId/amendments',
        destination: '/law/[lawId]/amendments',
      },
      {
        source: '/law/:lawId/branch/:chapterSeq',
        destination: '/law/[lawId]/branch/[chapterSeq]',
      },
    ];
  },
};

module.exports = nextConfig;