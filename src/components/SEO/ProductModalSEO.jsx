import { Helmet } from "react-helmet";

export default function ProductModalSEO({ product }) {
  if (!product) return null;

  const siteUrl = "https://chueks-frontend.vercel.app";
  const image =
    product?.imgPrimary?.url ||
    product?.imgPrimary ||
    product?.images?.[0] ||
    `${siteUrl}/placeholder.svg`;

  const title = `${product.name} | Chueks`;
  const description =
    product?.description ||
    `Explorá ${product.name} en Chueks, disponible al por mayor para revendedores.`;
  const price = product?.priceMin ?? product?.price ?? 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image: [image],
    brand: { "@type": "Brand", name: "Chueks" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: String(price),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Chueks" },
    },
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="product" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
