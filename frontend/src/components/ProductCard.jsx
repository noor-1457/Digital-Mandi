import { Heart, ShoppingCart, Star } from "lucide-react";
import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  // const navigate = useNavigate();

  const { addToCart, toggleWishlist, isInWishlist } =
   useContext(ShopContext);

  const {
    _id,
    name,
    category,
    image,
    price,
    quantity,
    rating = 4.5,
    reviews = 0,
  } = product;

  const imageUrl = image?.startsWith("http")
    ? image
    : `http://localhost:8000/${image}`;

      const liked = isInWishlist(_id);

  // ================= ADD TO CART =================
  const handleAddToCart = () => {
    addToCart(_id);
toast.success(
         "Product added to cart!",
      );
    // Add to cart ke baad Cart page par le jayega
    // navigate("/cart");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative group">

      {/* Wishlist */}
       <button
        onClick={() => toggleWishlist(_id)}
        className={`cursor-pointer absolute top-3 right-3 z-10 transition-colors ${
          liked ? "text-red-500" : "text-gray-400 hover:text-red-500"
        }`}
      >
        <Heart size={19} fill={liked ? "currentColor" : "none"} />
      </button>

      {/* Category Badge */}
      {category && (
        <span className="absolute top-3 left-3 bg-[#1a5c2e] text-white text-[10px] px-2 py-0.5 rounded-full z-10">
          {category}
        </span>
      )}

      {/* Image */}
      <div className="w-full h-30 flex items-center p-1.5 justify-center mb-3 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="rounded-lg h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/150?text=No+Image";
          }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col">

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
          {name}
        </h3>

        {/* Quantity */}
        <p className="text-xs text-gray-500 mt-0.5">
          {quantity} kg available
        </p>

        {/* Price */}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">
            Rs. {price}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={
                  i < Math.floor(rating)
                    ? "currentColor"
                    : "none"
                }
                className={
                  i < Math.floor(rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          <span className="text-xs text-gray-500">
            ({reviews})
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="cursor-pointer mt-3 w-full flex items-center justify-center gap-2 bg-[#006400] hover:bg-[#024202] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default ProductCard;