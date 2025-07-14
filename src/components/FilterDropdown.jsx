import ChevronDownIcon from "../ui/ChevronDownIcon";

export default function FilterDropdown({ value, onChange, categories }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value === "All" ? "" : e.target.value)
        }
        className="px-4 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-3 pointer-events-none">
       <ChevronDownIcon className="h-4 w-4 text-gray-400" />

      </div>
    </div>
  );
}
