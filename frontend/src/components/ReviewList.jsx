import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, MessageCircle } from "lucide-react";
import StarRating from "../components/StartRating";
import api from "../utils/api";

export default function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Reviews aur stats dono parallel fetch karein
        const [reviewsRes, statsRes] = await Promise.all([
          api.get(`/api/reviews/product/${productId}`),
          api.get(
            `/api/reviews/product/${productId}/stats`,
          ),
        ]);

        setReviews(reviewsRes.data.reviews || []);
        setStats(statsRes.data || null);
      } catch (err) {
        console.error("Reviews fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e8ebdf] bg-white p-6 text-center">
        <Loader2 size={22} className="mx-auto animate-spin text-[#006400]" />
      </div>
    );
  }

  // ================= NO REVIEWS =================
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e8ebdf] bg-white p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4e8]">
          <MessageCircle size={22} className="text-[#006400]" />
        </div>
        <h3 className="text-sm font-bold text-[#033303]">
          No reviews yet
        </h3>
        <p className="mt-1 text-xs text-[#788174]">
          Be the first to review this product after purchase.
        </p>
      </div>
    );
  }

  // ================= STATS BREAKDOWN =================
  const totalReviews = stats?.totalReviews || 0;

  return (
    <div className="space-y-4">
      {/* ============ RATING SUMMARY ============ */}
      {stats && (
        <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#596753]">
            Customer Reviews
          </h2>

          <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
            {/* Big average */}
            <div className="flex flex-col items-center justify-center text-center sm:border-r sm:border-[#edf0e7] sm:pr-6">
              <p className="text-4xl font-extrabold text-[#033303]">
                {stats.averageRating?.toFixed(1) || "0.0"}
              </p>
              <div className="mt-1.5">
                <StarRating
                  rating={stats.averageRating || 0}
                  size={16}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#788174]">
                {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.breakdown?.[star] || 0;
                const percent =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-8 text-[11px] font-semibold text-[#033303]">
                      {star}★
                    </span>

                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#edf0e7]">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="w-8 text-right text-[11px] text-[#788174]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ REVIEWS LIST ============ */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="rounded-2xl border border-[#e8ebdf] bg-white p-5"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf3e5] text-[#2f8f1f] font-bold text-sm">
                {review.buyerId?.fullName?.charAt(0).toUpperCase() || "?"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#033303]">
                    {review.buyerId?.fullName || "Anonymous"}
                  </p>
                  <p className="text-[10px] text-[#8a9285]">
                    {new Date(review.createdAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="mt-1">
                  <StarRating rating={review.rating} size={13} />
                </div>
              </div>
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="mt-3 whitespace-pre-line text-xs leading-6 text-[#4a5743]">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}