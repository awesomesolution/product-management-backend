import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';

// List Users
export const listUsers = async (req: Request, res: Response) => {
    const { fullName, email, status, startDate, endDate, page = '1', limit = '10' } = req.query;
    const filters: any = {};

    try {

        if (fullName) {
            filters.fullName = { $regex: fullName, $options: 'i' }; // Case-insensitive search
        }

        if (email) {
            filters.email = { $regex: email, $options: 'i' };
        }

        if (status) {
            filters.status = status;
        }

        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) {
                filters.createdAt.$gte = new Date(String(startDate));
            }
            if (endDate) {
                filters.createdAt.$lte = new Date(String(endDate));
            }
        }

        filters.role = { $ne: 'admin' };
        // Convert page and limit to numbers
        const pageNumber = parseInt(page as string, 1);
        const pageSize = parseInt(limit as string, 10);
        console.log("filters: ", filters);

        const users = await User.find(filters)
            .skip((pageNumber - 1) * pageSize) // Skip previous pages
            .limit(pageSize) // Limit the number of users per page

        // Get total number of users to calculate the total pages
        const totalUsers = await User.countDocuments(filters);

        res.status(200).json({
            success: true,
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / pageSize),
            currentPage: pageNumber,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users: ', error });
    }
};

// Activate/Deactivate User
export const toggleUserStatus = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status, updatedBy } = req.body;
    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (updatedBy) updateData.updatedBy = updatedBy;
    
    try {
        const user = await User.findByIdAndUpdate(userId, 
            { status: status },
            { new: true } // This will return the updated document
        );
        if (!user) {
            res.status(404).json({ success: false, message: 'User does not found...' });
        }
        res.status(200).json({ message: `User status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user status', error });
    }
};

// List Products
export const listProducts = async (req: Request, res: Response) => {
    const { name, description, status, startDate, endDate, page = '1', limit = '10' } = req.query;
    const filters: any = {};

    try {

        if (name) {
            filters.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        if (description) {
            filters.description = { $regex: description, $options: 'i' };
        }

        if (status) {
            filters.status = status;
        }

        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) {
                filters.createdAt.$gte = new Date(String(startDate));
            }
            if (endDate) {
                filters.createdAt.$lte = new Date(String(endDate));
            }
        }

        // Convert page and limit to numbers
        const pageNumber = parseInt(page as string, 1);
        const pageSize = parseInt(limit as string, 10);

        const products = await Product.find(filters)
            .populate('createdBy', 'fullName') // Populating createdBy with user's name
            .skip((pageNumber - 1) * pageSize) // Skip previous pages
            .limit(pageSize) // Limit the number of products per page

        // Get total number of products to calculate the total pages
        const totalProducts = await Product.countDocuments(filters);

        res.status(200).json({
            success: true,
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / pageSize),
            currentPage: pageNumber,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

export const createProduct = async (req: Request, res: Response) => {

    try {
        const { name, description, createdBy } = req.body;

        // Input validation
        if (!name || !description) {
            res.status(400).json({ message: "All fields are required." });
        }

        if (description.length < 10 || description.length > 200) {
            res.status(400).json({
                message: "Description must be between 10 and 200 characters.",
            });
        }

        // Create and save the product
        const product = new Product({ name, description });
        await product.save();
        res.status(201).json({ message: "Product created successfully.", product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Update Product Route
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params; // Get productId from URL
    const { name, description, createdBy } = req.body;
    // const image = req?.file;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (createdBy) updateData.createdBy = createdBy;
    // if (image) updateData.image = image.path;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found...' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating product: ', error });
    }
};

// Get Product by ID (for editing)
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found...' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching product: ', error });
    }
};

export const softDeleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndUpdate(
            productId,
            { status: 'Deleted' },
            { new: true } // This will return the updated document
        );

        if (!product) {
            res.status(404).json({ success: false, message: 'Product does not found...' });
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully...', product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error while deleting product: ', error });
    }
};