import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { PiCurrencyInrLight } from "react-icons/pi";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthProvider";
import { ShoppingBag, Zap, Minus, Plus, Heart, Share2 } from "lucide-react";

const SingleProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await instance.get(`/product/slug/${slug}`);
        setProduct(res.data);
        setMainImage(res.data.images[0]);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  async function handleAddToCart() {
    if (!isLoggedIn) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    try {
      setCartLoading(true);
      await instance.post("/cart/add", {
        productId: product._id,
        quantity,
        size: selectedSize,
      }, { withCredentials: true });
      toast.success("Added to cart 🛒");
      setTimeout(() => navigate("/cart"), 600);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  }

  if (loading) return (
    <div className="h-screen flex flex-col justify-center items-center gap-4 bg-white">
      <div className="w-12 h-12 border-[3px] border-slate-200 border-t-black rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-[3px] text-slate-400">Loading Product</p>
    </div>
  );

  if (!product) return <div className="text-center py-20 font-bold">Product not found</div>;

  const discountPercentage = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10">
        
        {/* Breadcrumbs (Optional but looks professional) */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
          <span>Home</span> / <span>Shop</span> / <span className="text-black">{product.category}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* --- LEFT: IMAGE SECTION --- */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-5">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 h-fit overflow-auto no-scrollbar">
              {product.images.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 flex-shrink-0 ${mainImage?.url === img.url ? 'border-black shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
                </div>
              ))}
            </div>

            {/* Main Display */}
            <div className="flex-1 relative group overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm">
               <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                  <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30 uppercase tracking-tighter">
                    {discountPercentage}% Off
                  </span>
               </div>
               <div className="absolute top-5 right-5 z-10 flex flex-col gap-3">
                  <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 hover:scale-110 transition-all shadow-md">
                    <Heart size={18} />
                  </button>
                  <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 hover:text-blue-500 hover:scale-110 transition-all shadow-md">
                    <Share2 size={18} />
                  </button>
               </div>
               <img 
                 src={mainImage?.url} 
                 className="w-full h-[550px] object-contain transition-transform duration-700 group-hover:scale-110" 
                 alt="main" 
               />
            </div>
          </div>

          {/* --- RIGHT: DETAILS SECTION --- */}
          <div className="lg:col-span-5 pt-4">
            <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-2 uppercase italic tracking-tighter">
              {product.name}
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[2px] mb-6">{product.category}</p>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-black text-black flex items-center">
                <PiCurrencyInrLight size={32} /> {product.discountedPrice}
              </span>
              <del className="text-slate-400 text-lg font-bold mb-1">₹{product.originalPrice}</del>
              <span className="text-green-600 font-black text-sm mb-1 uppercase tracking-tighter">(Save ₹{product.originalPrice - product.discountedPrice})</span>
            </div>

            <p className="text-slate-600 leading-relaxed font-medium mb-10 border-l-4 border-slate-100 pl-5">
              {product.description}
            </p>

            {/* SIZE SELECTOR */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-900">Select Size</h3>
                <button className="text-[10px] font-bold text-blue-600 underline uppercase tracking-tighter">Size Guide</button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {(product.sizes?.length > 0 ? product.sizes : ["6", "7", "8", "9", "10"]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-2xl font-black transition-all duration-300 border-2 flex items-center justify-center ${
                      selectedSize === size
                        ? "bg-black border-black text-white shadow-xl shadow-black/20 scale-110 z-10"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY & ACTIONS */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-900 min-w-[80px]">Quantity</h3>
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                  <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-red-500 active:scale-90 transition-all">
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-black text-slate-800">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-green-600 active:scale-90 transition-all">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="flex-1 bg-black text-white h-16 rounded-[2rem] font-black uppercase tracking-[2px] flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                >
                  {cartLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><ShoppingBag size={20} /> Add to Cart</>}
                </button>

                <button
                  onClick={() => navigate("/checkout")}
                  className="flex-1 border-2 border-slate-900 text-slate-900 h-16 rounded-[2rem] font-black uppercase tracking-[2px] flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white active:scale-95 transition-all"
                >
                  <Zap size={20} fill="currentColor" /> Buy Now
                </button>
              </div>
            </div>

            {/* TRUST BADGES (Optional) */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fast Delivery</p>
                  <p className="text-[10px] font-bold text-slate-800">2-4 Business Days</p>
               </div>
               <div className="text-center border-x border-slate-100 px-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Easy Returns</p>
                  <p className="text-[10px] font-bold text-slate-800">30 Days Window</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Secure Payment</p>
                  <p className="text-[10px] font-bold text-slate-800">SSL Encrypted</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default SingleProduct;