import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Rating = ({
  value,
  text,
  color,
  size = "text-lg",
  showText = true,
  interactive = false,
  onRatingChange,
}) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const handleStarClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const getStarColor = (starType) => {
    if (color) {
      return color;
    }

    switch (starType) {
      case "full":
        return "text-yellow-400";
      case "half":
        return "text-yellow-400";
      case "empty":
        return "text-gray-400";
      default:
        return "text-yellow-400";
    }
  };

  const getStarSize = () => {
    switch (size) {
      case "xs":
        return "text-xs";
      case "sm":
        return "text-sm";
      case "base":
        return "text-base";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      case "2xl":
        return "text-2xl";
      case "3xl":
        return "text-3xl";
      default:
        return "text-lg";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, index) => (
          <span
            key={`full-${index}`}
            className={`${getStarColor("full")} ${getStarSize()} ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform duration-200"
                : ""
            }`}
            onClick={() => handleStarClick(index + 1)}
            title={interactive ? `Rate ${index + 1} stars` : undefined}
          >
            <FaStar />
          </span>
        ))}

        {/* Half Star */}
        {halfStars === 1 && (
          <span
            className={`${getStarColor("half")} ${getStarSize()} ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform duration-200"
                : ""
            }`}
            onClick={() => handleStarClick(fullStars + 0.5)}
            title={interactive ? `Rate ${fullStars + 0.5} stars` : undefined}
          >
            <FaStarHalfAlt />
          </span>
        )}

        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <span
            key={`empty-${index}`}
            className={`${getStarColor("empty")} ${getStarSize()} ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform duration-200"
                : ""
            }`}
            onClick={() => handleStarClick(fullStars + halfStars + index + 1)}
            title={
              interactive
                ? `Rate ${fullStars + halfStars + index + 1} stars`
                : undefined
            }
          >
            <FaRegStar />
          </span>
        ))}
      </div>

      {/* Rating Text */}
      {showText && text && (
        <span className={`ml-2 text-sm ${color || "text-gray-300"}`}>
          {text}
        </span>
      )}

      {/* Rating Value (optional) */}
      {showText && !text && (
        <span className={`ml-2 text-sm ${color || "text-gray-300"}`}>
          {value ? `${value.toFixed(1)}/5.0` : "0.0/5.0"}
        </span>
      )}
    </div>
  );
};

Rating.defaultProps = {
  color: null,
  size: "text-lg",
  showText: true,
  interactive: false,
  onRatingChange: null,
};

export default Rating;
