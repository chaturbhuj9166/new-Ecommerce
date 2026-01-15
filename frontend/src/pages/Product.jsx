import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await instance.get("/product");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }
  console.log(products);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold text-gray-700">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Our Products
      </h2>

      {products.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2
                     md:grid-cols-3 lg:grid-cols-4
                     gap-6"
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No products found
        </p>
      )}
    </div>
  );
}

export default Products;
