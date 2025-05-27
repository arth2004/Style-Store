import Category from "../models/categoryModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    // console.log(name);
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Category already exists" });
    }
    const category = await new Category({ name }).save();
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;
    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    category.name = name;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.log(error);
    return res.status(400).json(err);
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    await Category.deleteOne({ _id: categoryId });
    res.json({ message: "Category removed" });
  } catch (error) {
    res.status(404).json(error);
  }
});

export const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    res.status(404).json(error.message);
  }
});

export const readCategory=asyncHandler(async(req,res)=>{
  try {
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);
    res.json(category);
  } catch (error) {
    res.status(404).json(error.message)
  }
})
