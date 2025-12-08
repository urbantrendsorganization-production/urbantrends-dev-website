import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

function AdminProducts() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 50,
      features: '',
      image: '',
      popular: false,
    },
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://urbantrends-backend-production-fde8.up.railway.app/products/prods'
      );
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Create or Update product
  const onSubmit = async (data) => {
    setSaving(true);
    const payload = {
      ...data,
      features: data.features.split(',').map((f) => f.trim()),
    };

    try {
      if (editingProduct) {
        // Update
        await axios.put(
          `https://urbantrends-backend-production-fde8.up.railway.app/products/products/${editingProduct._id}`,
          payload
        );
        toast.success('Product updated successfully');
      } else {
        // Create
        await axios.post(
          'https://urbantrends-backend-production-fde8.up.railway.app/products/create',
          payload
        );
        toast.success('Product added successfully');
      }

      reset();
      setEditingProduct(null);
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeleting(true);
      await axios.delete(
        `https://urbantrends-backend-production-fde8.up.railway.app/products/product/${id}`
      );
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  // Open modal for editing
  const handleEdit = (product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      features: Array.isArray(product.features)
        ? product.features.join(', ')
        : product.features,
      image: product.image,
      popular: product.popular,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-silver">Product Management</h2>
        <Button
          onClick={() => {
            reset();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="bg-silver text-black hover:bg-silver/90"
        >
          Create New Product
        </Button>
      </div>

      {/* PRODUCT DISPLAY */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-silver border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {products.length === 0 ? (
              <p className="text-silver text-center col-span-full">No products found.</p>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  className="border border-silver/30 p-6 rounded-xl bg-gunmetal text-white space-y-4 shadow-md"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-xl font-semibold text-silver">{product.name}</h3>
                  <p className="text-sm text-silver/80 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                  <p className="text-silver font-bold text-lg">Ksh {product.price}</p>
                  <div className="text-xs text-silver/50">
                    {Array.isArray(product.features)
                      ? product.features.join(', ')
                      : product.features}
                  </div>
                  <br />

                  <div>
                    <Button
                    size="sm"
                    className="bg-amber-500 text-black w-full hover:bg-silver/80 mt-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </Button>
                  </div>
                  <br />

                  
                  

                  <Button
                    size="sm"
                    className="bg-red-600 text-white w-full hover:bg-red-700 mt-2"
                    onClick={() => handleDelete(product._id)}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-black border border-silver text-white">
          <DialogHeader>
            <DialogTitle className="text-silver">
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-silver">Product Name</label>
              <Input
                {...register('name')}
                className="bg-gunmetal text-white"
                placeholder="Enter product name"
              />
            </div>
            <br />

            <div>
              <label className="text-sm text-silver">Description</label>
              <Textarea
                {...register('description')}
                className="bg-gunmetal text-white"
                placeholder="Short description"
              />
            </div>
            <br />

            <div>
              <label className="text-sm text-silver">Price (Ksh)</label>
              <Input
                type="number"
                {...register('price')}
                className="bg-gunmetal text-white"
              />
            </div>
            <br />

            <div>
              <label className="text-sm text-silver">Features (comma separated)</label>
              <Input
                {...register('features')}
                className="bg-gunmetal text-white"
                placeholder="Feature1, Feature2..."
              />
            </div>
            <br />

            <div>
              <label className="text-sm text-silver">Image URL</label>
              <Input
                {...register('image')}
                className="bg-gunmetal text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <br />

            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                  reset();
                }}
                className="bg-dim-grey text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="bg-silver text-black hover:bg-silver/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                    {editingProduct ? 'Updating...' : 'Saving...'}
                  </>
                ) : editingProduct ? (
                  'Update Product'
                ) : (
                  'Save Product'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminProducts;
