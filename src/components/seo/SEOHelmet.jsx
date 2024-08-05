import React from 'react';
import { Helmet } from 'react-helmet-async';

function SEOHelmet() {
  return (
    <Helmet>
      {/* Title */}
      <title>Selected. — Music</title>

      {/* Meta tags */}
      <meta
        name="description"
        content="Born in 2013, selected. is a Berlin based record label & music blog focussing on House Music. ."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="utf-8" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://selectedbase.com/" />
      <meta property="og:title" content="Selected. — Music" />
      <meta
        property="og:description"
        content="Born in 2013, selected. is a Berlin based record label & music blog focussing on House Music. ."
      />

      {/* Additional Meta Tags */}
      <meta
        name="keywords"
        content="record label, Berlin, House Music, music blog"
      />
      <meta name="author" content="Kenny Choi" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.png" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://selectedbase.com/" />
    </Helmet>
  );
}

export default SEOHelmet;
