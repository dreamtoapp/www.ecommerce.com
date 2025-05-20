import { getProductById } from './actions';
import ProductDetails from './component/ProductDetails';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const producid = params.id;
  const product = await getProductById(producid);

  if (!product) {
    return <div>Product not found</div>;
  }

  // Normalize details, size, and all nullable string fields to undefined if null
  const normalizedProduct = {
    ...product,
    details: product.details === null ? null : product.details,
    size: product.size === null ? null : product.size,
    productCode: product.productCode === null ? null : product.productCode,
    gtin: product.gtin === null ? null : product.gtin,
    brand: product.brand === null ? null : product.brand,
    material: product.material === null ? null : product.material,
    color: product.color === null ? null : product.color,
    dimensions: product.dimensions === null ? null : product.dimensions,
    weight: product.weight === null ? null : product.weight,
    careInstructions: product.careInstructions === null ? null : product.careInstructions,
    shippingDays: product.shippingDays === null ? null : product.shippingDays,
    imageUrl: product.imageUrl === null ? null : product.imageUrl,
  };

  return (
    <div className='p-4'>
      <ProductDetails product={{ ...normalizedProduct, size: normalizedProduct.size ?? null, details: normalizedProduct.details ?? null, imageUrl: normalizedProduct.imageUrl ?? null, productCode: normalizedProduct.productCode ?? null, gtin: normalizedProduct.gtin ?? null, brand: normalizedProduct.brand ?? null, material: normalizedProduct.material ?? null, color: normalizedProduct.color ?? null }} />
    </div>
  );
}
