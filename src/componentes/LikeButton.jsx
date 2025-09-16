import { useState } from "react";

export default function LikeButtonMaqueta() {
  const [likes, setLikes] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const handleToggle = () => {
      setLikes((prev) => prev + 1);
      setIsFav(true);
  };

  return (
    <button
      className="like p-0 glass"
      onClick={handleToggle}
      title={isFav ? "Quitar me gusta" : "Dar me gusta"}
      aria-pressed={isFav}
      style={{ fontSize: 22, lineHeight: 1 }}
    >
      {isFav ? "❤️" : "🤍"}
      <span className="ml-1 text-sm text-gray-600">{likes}</span>
    </button>
  );
}
