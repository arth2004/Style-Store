const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Category Name
          </label>
          <input
            id="categoryName"
            type="text"
            className="py-3 px-4 bg-[#0f0f10] border border-gray-600 rounded-lg w-full text-white placeholder-gray-400 focus:ring-2 focus:ring-[#50C878] focus:border-[#50C878] transition-colors disabled:bg-gray-800 disabled:cursor-not-allowed"
            placeholder="Enter category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={disabled}
            className="flex-1 bg-[#50C878] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#45a06a] focus:outline-none focus:ring-2 focus:ring-[#50C878] focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-600"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              type="button"
              disabled={disabled}
              className="bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-600"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
