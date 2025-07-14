import ClearSearchIcon from "../ui/ClearSearchIcon";

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder="Search courses by title or teacher..."
        className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={onChange}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
                  <ClearSearchIcon className="h-5 w-5" />

        </button>
      )}
    </div>
  );
}
