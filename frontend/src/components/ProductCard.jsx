import { Link } from "react-router-dom";
import { PiCurrencyInrLight } from "react-icons/pi";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white/80 backdrop-blur
                 rounded-2xl overflow-hidden
                 border border-slate-200
                 shadow-md hover:shadow-2xl
                 hover:-translate-y-2
                 transition-all duration-300"
    >
      {/* IMAGE */}
      <div className="w-full h-52 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-contain p-4
                     group-hover:scale-110
                     transition-transform duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition">
          {product.name}
        </h3>

        <p className="flex items-center gap-1 text-lg font-bold text-emerald-600">
          <PiCurrencyInrLight />
          {product.discountedPrice}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
