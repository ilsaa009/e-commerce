import ProductCardsSkeleton from './components/Skeleton';
import PaginationControls from './components/PaginationControls';
import Link from 'next/link';
import { Suspense } from 'react';

async function fetchProducts(page, perPage) {
  const skip = (page - 1) * perPage;
  const response = await fetch(`https://dummyjson.com/products?limit=${perPage}&skip=${skip}`);
  const data = await response.json();
  return data;
}

export default async function Home({ searchParams }) {
  const page = Number(searchParams.page ?? 1);
  const perPage = Number(searchParams.per_page ?? 9);

  const data = await fetchProducts(page, perPage);
  const products = data.products;
  const totalEntries = data.total;

  return (
    <div className="flex flex-col gap-4 items-center">
       <head>
        <title>Home - Product Listings</title>
        <meta name="description" content="Browse our collection of amazing products." />
      </head>
        <h1 className="text-2xl font-semibold mb-4 text-black">Product</h1>

        <Suspense fallback={<ProductCardsSkeleton />}>
          <ProductList products={products} />
        </Suspense>

        <PaginationControls
          hasNextPage={page * perPage < totalEntries}
          hasPrevPage={page > 1}
          totalEntries={totalEntries}
          currentPage={page}
          perPage={perPage} />
      </div>
  );
}

function ProductList({ products }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id}>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg h-80 w-60">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-36 w-36 object-cover mb-4"
            />
            <h2 className="text-lg font-bold text-black text-center truncate w-full">
              {product.title}
            </h2>
            <p className="text-lg font-semibold text-green-600">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
