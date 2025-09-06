import { Star } from "lucide-react";

const RenderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1;
    const stars = [];
 

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="text-yellow-400" fill="currentColor" />
        );
      } else if (i === fullStars && partialStar > 0) {
        const percentage = partialStar * 100;
        stars.push(
          <div key={i} className="relative inline-block">
            <Star className="text-yellow-400" />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${percentage}%` }}
            >
              <Star className="text-yellow-400" fill="currentColor" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  export default RenderStars