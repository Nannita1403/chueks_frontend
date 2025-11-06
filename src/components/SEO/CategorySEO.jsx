import { Helmet } from "react-helmet";

export default function CategorySEO({ category, products = []  }) {
  const siteUrl = "https://chueks-frontend.vercel.app";
  const normalizedCategory =
    category?.charAt(0).toUpperCase() + category?.slice(1).toLowerCase();

  const title = category
    ? `Compra ${normalizedCategory} al por mayor | Chueks`
    : "Productos mayoristas de moda | Chueks";

  const description = category
    ? `Explorá nuestra colección de ${normalizedCategory} al por mayor. Variedad, calidad y precios pensados para revendedores.`
    : "Descubrí la tienda online mayorista Chueks: moda, accesorios y bolsos al por mayor. Ideal para revendedores.";

  const image = `${siteUrl}/og-image.jpg`;
  const url = category
    ? `${siteUrl}/category/${category.toLowerCase()}`
    : `${siteUrl}/products`;

    const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: normalizedCategory || "Productos",
    description: description,
    url: url,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/product/${product._id}`,
      name: product.name,
      image:
        product?.imgPrimary?.url ||
        product?.imgPrimary ||
        product?.images?.[0] ||
        `${siteUrl}/placeholder.svg`,
      ...(product?.price && {
        offers: {
          "@type": "Offer",
          price: String(product.price),
          priceCurrency: "ARS",
          availability: "https://schema.org/InStock",
        },
      }),
    })),
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
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