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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold text-slate-600 animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2
        className="text-4xl font-extrabold mb-12 text-center
                   bg-gradient-to-r from-indigo-600 to-cyan-500
                   bg-clip-text text-transparent"
      >
        Our Products
      </h2>

      {products.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2
                     md:grid-cols-3 lg:grid-cols-4
                     gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500">
          No products found
        </p>
      )}
    </div>
  );
}

export default Products;
