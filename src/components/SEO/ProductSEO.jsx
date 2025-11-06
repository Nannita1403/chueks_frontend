import { Helmet } from "react-helmet";

export default function ProductSEO({ product }) {
  if (!product) return null;

  const siteUrl = "https://chueks-frontend.vercel.app";
  const productUrl = `${siteUrl}/product/${product._id}`;
  const image =
    product?.imgPrimary?.url ||
    product?.imgPrimary ||
    product?.images?.[0] ||
    `${siteUrl}/placeholder.svg`;

  const title = `${product.name} | Chueks - Mayorista de moda`;
  const description =
    product?.description ||
    `Comprá ${product.name} al por mayor en Chueks. Calidad, diseño y los mejores precios para revendedores.`;

  const price = product?.priceMin ?? product?.price ?? 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: description,
    image: [image],
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: "Chueks",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "ARS",
      price: String(price),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Chueks",
      },
    },
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={productUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:type" content="product" />
      <meta property="product:price:amount" content={price} />
      <meta property="product:price:currency" content="ARS" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
