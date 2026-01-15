import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";
import instance from "../axiosConfig";
import { useParams } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";

const count = 8;

function CategoryProducts() {
  const { category } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef(null);

  useEffect(() => {
    async function fetchCategoryProducts() { 
      try {
        setLoading(true);
        const res = await instance.get(`/product?category=${category}`);
  
        setAllProducts(res.data);
  
        const firstBatch = getRandomProducts(res.data, count);
        setVisibleProducts(firstBatch);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
  }, [category]);

  function getRandomProducts(arr, count1) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count1);
  }

  useEffect(() => {
    function loadMoreProducts() {
      if (loadingMore) return;
  
      setLoadingMore(true);
  
      setTimeout(() => {
        const more = getRandomProducts(allProducts, count);
        setVisibleProducts(prev => [...prev, ...more]);
        setLoadingMore(false);
      }, 400);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [allProducts, loadingMore]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Category: {category}
          </h2>
          <p className="text-slate-500 mt-1">
            Showing products from {category}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative">
              <FaShoppingBag className="text-6xl text-teal-600 animate-bounce" />
              <div className="absolute -inset-4 border-2 border-dashed border-teal-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-500 text-sm tracking-wide">
              Loading category products...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={`${product._id}-${index}`}
                  product={product}
                  slug={product.slug}
                />
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center py-10">
                <FaShoppingBag className="text-4xl text-teal-600 animate-bounce" />
              </div>
            )}

            <div ref={observerRef} className="h-10"></div>
          </>
        )}

      </div>
    </div>
  );
}

export default CategoryProducts;