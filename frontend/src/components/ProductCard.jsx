import { Link } from "react-router-dom";
import { PiCurrencyInrLight } from "react-icons/pi";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden
                 border shadow-sm hover:shadow-xl
                 transition-all duration-300"
    >
      {/* IMAGE */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover
                     group-hover:scale-110
                     transition-transform duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">
          {product.name}
        </h3>

        <p className="flex items-center gap-1 mt-2
                      text-lg font-bold text-green-600">
          <PiCurrencyInrLight />
          {product.discountedPrice}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
