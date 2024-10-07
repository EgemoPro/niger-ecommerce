const ProductRating = ({ rating, reviews }) => (
  <div className="flex items-center mb-1">
    <div className="flex text-yellow-400 text-xs">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {index < Math.floor(rating) ? (
            "★"
          ) : index < rating ? (
            <span style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  overflow: "hidden",
                  width: `${(rating % 1) * 100}%`,
                }}
              >
                ★
              </span>
              <span style={{ opacity: 0.3 }}>★</span>
            </span>
          ) : (
            <span style={{ opacity: 0.3 }}>★</span>
          )}
        </span>
      ))}
    </div>
    <span className="text-xs text-gray-600 ml-1">
      {rating.toFixed(1)} ({reviews} Sell)
    </span>
  </div>
);

export default ProductRating;
