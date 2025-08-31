import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import { FaPlus, FaEdit, FaTrash, FaFolder, FaTimes } from "react-icons/fa";

const CategoryLists = () => {
  const { data: categories, isLoading, refetch } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCategory({ name: name.trim() }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} category created successfully!`);
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error("Creating category failed, try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName.trim(),
        },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} category updated successfully!`);
        setSelectedCategory(null);
        setModalVisible(false);
        setUpdatingName("");
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error("Updating category failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} category deleted successfully!`);
        setSelectedCategory(null);
        setModalVisible(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error("Deleting category failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setUpdatingName(category.name);
    setModalVisible(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
    setUpdatingName("");
  };

  if (isLoading) {
    return (
      <div className="mt-20 flex flex-col md:flex-row p-4">
        <AdminMenu />
        <div className="flex-1 p-3">
          <div className="flex items-center justify-center h-64">
            <Loader spinnerSize="h-12 w-12" label="Loading categories..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col md:flex-row p-4">
      <AdminMenu />
      <div className="flex-1 p-3">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center gap-3 mb-2">
            <div className="flex gap-4 items-center">
              <FaFolder className="text-3xl text-[#50C878]" />
              <h1 className="text-3xl font-bold text-white">
                Manage Categories
              </h1>
            </div>
            <p className="text-gray-300 text-lg">
              Create, edit, and manage product categories for your store
            </p>
          </div>
        </div>

        {/* Create Category Form */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaPlus className="text-[#50C878] text-lg" />
            <h2 className="text-xl font-semibold text-white">
              Add New Category
            </h2>
          </div>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            buttonText={isSubmitting ? "Creating..." : "Create Category"}
            disabled={isSubmitting}
          />
        </div>

        {/* Categories Display */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaFolder className="text-[#50C878] text-lg" />
              <h2 className="text-xl font-semibold text-white">
                Existing Categories
              </h2>
            </div>
            <span className="bg-[#50C878] text-white px-3 py-1 rounded-full text-sm font-medium">
              {categories?.length || 0} categories
            </span>
          </div>

          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="group relative bg-[#0f0f10] border border-gray-700 rounded-lg p-4 hover:border-[#50C878] transition-all duration-300 hover:shadow-lg hover:shadow-[#50C878]/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <FaFolder className="text-2xl text-[#50C878]" />
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {category.name}
                  </h3>

                  <div className="text-sm text-gray-400 mb-3">
                    ID: {category._id.slice(-8)}...
                  </div>

                  <div className="pt-3 border-t border-gray-700">
                    <button
                      onClick={() => openEditModal(category)}
                      className="w-full bg-[#50C878] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#45a06a] transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <FaEdit className="text-xs" />
                      Edit Category
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaFolder className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Categories Found
              </h3>
              <p className="text-gray-500 mb-4">
                Start by creating your first category above
              </p>
            </div>
          )}
        </div>

        {/* Edit/Delete Modal */}
        <Modal isOpen={modalVisible} onClose={closeModal}>
          <div className="bg-[#1a1a1a] rounded-lg border border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {selectedCategory ? "Edit Category" : "Category Actions"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {selectedCategory && (
                <div className="mb-6 p-4 bg-[#0f0f10] rounded-lg border border-gray-700">
                  <p className="text-gray-300 text-sm mb-2">
                    Selected Category:
                  </p>
                  <p className="text-white font-medium text-lg">
                    {selectedCategory.name}
                  </p>
                </div>
              )}

              <CategoryForm
                value={updatingName}
                setValue={setUpdatingName}
                handleSubmit={handleUpdateCategory}
                buttonText={isSubmitting ? "Updating..." : "Update Category"}
                handleDelete={handleDeleteCategory}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryLists;
