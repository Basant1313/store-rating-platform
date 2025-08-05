import { Star, StarHalf, Star as StarOutline } from "lucide-react";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating); // 3
  const hasHalfStar = rating % 1 >= 0.5; // true if 3.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // 1.5 -> 1 full, 1 half, 3 empty

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={20} className="text-yellow-400 fill-yellow-400" />
      ))}

      {hasHalfStar && (
        <StarHalf size={20} className="text-yellow-400 fill-yellow-400" />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <StarOutline key={`empty-${i}`} size={20} className="text-gray-300" />
      ))}
    </div>
  );
};

export default StarRating;
