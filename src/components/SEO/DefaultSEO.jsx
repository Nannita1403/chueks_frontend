import { Helmet } from "react-helmet";

export default function DefaultSEO() {
  const siteUrl = "https://chueks-frontend.vercel.app";
  const title = "Chueks - Tienda Online Mayorista de Moda y Accesorios";
  const description =
    "Chueks es tu tienda mayorista de confianza. Mochilas, carteras, bolsos y accesorios al por mayor, con los mejores precios para revendedores.";
  const image = `${siteUrl}/og-image.jpg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Chueks",
    url: siteUrl,
    logo: `${siteUrl}/logoRedondo.png`,
    sameAs: [
      "https://www.instagram.com/chueks.ok",
      "https://www.facebook.com/chueks.ok",
    ],
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={siteUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Chueks" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
