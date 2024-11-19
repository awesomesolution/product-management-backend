import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true, minlength: 10, maxlength: 200 },
    // imageUrl: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Deleted'], default: 'Active' },
    createdAt: { type: Date, default: Date.now},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);