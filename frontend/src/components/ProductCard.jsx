import { Heart, ShoppingCart, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const {
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

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative group">
      {/* Wishlist */}
      <button className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors z-10">
        <Heart size={19} />
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
            e.target.src = "https://via.placeholder.com/150?text=No+Image";
          }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
          {name}
        </h3>

        <p className="text-xs text-gray-500 mt-0.5">{quantity} kg</p>

        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">Rs. {price}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                className={
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Add to Cart */}
        <button className="cursor-pointer mt-3 w-full flex items-center justify-center gap-2 bg-[#006400] hover:bg-[#024202] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
