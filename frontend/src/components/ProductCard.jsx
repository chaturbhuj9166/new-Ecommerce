import { PiCurrencyInrLight } from "react-icons/pi";
import { Link } from "react-router-dom";

const trimContent = (text = "", maxLength = 30) => {
  return text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;
};

function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      
      {/* 🖼️ Product Image */}
      <div className="w-full h-56 overflow-hidden bg-slate-50">
        <Link to={`/product/${product.slug}`}>
          <img
            src={`http://localhost:3000/${product.image}`}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* 📦 Content */}
      <div className="p-4 space-y-1">

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-slate-800 leading-tight">
          <Link
            to={`/product/${product.slug}`}
            className="hover:text-indigo-600 transition"
          >
            {trimContent(product.name, 22)}
          </Link>
        </h3>

        {/* Price */}
        <div className="flex items-center gap-1 text-sm">
          <PiCurrencyInrLight className="text-slate-500" />

          {product.discountedPrice &&
          product.discountedPrice < product.originalPrice ? (
            <>
              <del className="text-slate-400 text-xs">
                {product.originalPrice}
              </del>
              <span className="text-emerald-600 font-bold text-sm">
                {product.discountedPrice}
              </span>
            </>
          ) : (
            <span className="font-bold text-slate-800">
              {product.originalPrice}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductCard;
