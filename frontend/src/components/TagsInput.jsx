import { useState } from "react";

export default function TagsInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tags (Press Enter or comma to add)
      </label>
      <div className="flex flex-wrap gap-2 p-2 md:p-3 border-2 border-dashed border-stone-600 rounded-sm bg-stone-800 min-h-[3rem] md:min-h-[3.5rem]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-stone-700 text-stone-100 px-2 py-1 rounded-sm text-xs md:text-sm"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-red-600 px-0 py-1"
            >
              <svg
                className="w-3 h-3 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-1 min-w-[100px] md:min-w-[120px] outline-none bg-transparent text-white text-sm md:text-base"
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Suggested: design, illustration, photography, ui/ux, 3d, animation
      </p>
    </div>
  );
}