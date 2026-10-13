import { Star } from "lucide-react";

/**
 * StarRating component
 *
 * @param {number} rating - Current rating (0-5)
 * @param {number} size - Size of stars in pixels (default: 16)
 * @param {boolean} interactive - Agar true hai toh click karke rating change ho sakti hai
 * @param {function} onRatingChange - Jab user star click kare (interactive mode)
 * @param {boolean} showValue - Rating number text ke saath dikhaye
 */
export default function StarRating({
  rating = 0,
  size = 16,
  interactive = false,
  onRatingChange,
  showValue = false,
}) {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="inline-flex items-center gap-0.5">
        {stars.map((star) => {
          // Half star logic: agar rating 4.5 hai toh 5th star half fill
          const filled = star <= Math.floor(rating);
          const halfFilled = !filled && star - 0.5 <= rating;

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              disabled={!interactive}
              className={`transition-transform ${
                interactive
                  ? "cursor-pointer hover:scale-110"
                  : "cursor-default"
              }`}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                size={size}
                className={
                  filled || halfFilled
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }
                // Half fill effect ke liye
                style={
                  halfFilled
                    ? {
                        fill: "url(#halfGradient)",
                      }
                    : {}
                }
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="ml-1 text-xs font-semibold text-[#033303]">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}