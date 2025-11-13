import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, addToCartAsync, updateCartItemAsync, fetchCartAsync } from 'shopping_dashboard/store';
import './Module.css';
import { Product } from './products';
import { fetchProductById } from './api';

const ProductDetail = () => {
  const { category, productId, subCategory } = useParams<{ category: string; productId?: string; subCategory?: string }>();
  const actualProductId = productId || subCategory;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      const cartItem = cartItems.find((item: { product: { id: number }; quantity: number }) => item.product.id === product.id);
      const currentCartQuantity = cartItem?.quantity ?? 0;
      setCartQuantity(currentCartQuantity);
      if (currentCartQuantity > 0) {
        setQuantity(1);
      }
    }
  }, [product, cartItems]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!category || !actualProductId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productIdNum = parseInt(actualProductId, 10);
        if (isNaN(productIdNum)) {
          throw new Error('Invalid product ID');
        }
        const fetchedProduct = await fetchProductById(category, productIdNum);
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [category, actualProductId]);

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const productIdNum = parseInt(actualProductId || '', 10);
      if (isNaN(productIdNum)) {
        throw new Error('Invalid product ID');
      }

      if (cartQuantity > 0) {
        await dispatch(updateCartItemAsync({ 
          productId: productIdNum, 
          quantity: cartQuantity + quantity 
        }));
      } else {
        await dispatch(addToCartAsync({ 
          productId: productIdNum, 
          quantity 
        }));
      }

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      dispatch(fetchCartAsync());
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const getCategoryPath = (cat?: string): string => {
    switch (cat) {
      case 'electronics':
        return '/shopping/electronics';
      case 'mobiles':
        return '/shopping/mobiles';
      case 'clothing':
      default:
        return '/shopping/clothing';
    }
  };

  if (loading) {
    return (
      <div className="pdp-container">
        <div className="pdp-not-found">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pdp-container">
        <div className="pdp-not-found">
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate(getCategoryPath(category))} className="back-button">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdp-container">
      <button onClick={() => navigate(getCategoryPath(category))} className="back-button">
        ← Back to Products
      </button>
      
      <div className="pdp-content">
        <div className="pdp-image-section">
          <div className="pdp-product-image">{product.image}</div>
        </div>
        
        <div className="pdp-details-section">
          <h1 className="pdp-product-name">{product.name}</h1>
          <p className="pdp-product-category">{product.category}</p>
          <p className="pdp-product-price">${product.price.toFixed(2)}</p>
          
          <div className="pdp-description">
            <h3>Product Description</h3>
            <p>
              This is a high-quality {product.name.toLowerCase()} from our {product.category.toLowerCase()} collection. 
              Made with premium materials and attention to detail, this product offers excellent value and style.
            </p>
          </div>

          {cartQuantity > 0 && (
            <div className="pdp-cart-info">
              <p>Currently in cart: {cartQuantity} {cartQuantity === 1 ? 'item' : 'items'}</p>
            </div>
          )}

          <div className="pdp-quantity-section">
            <label htmlFor="quantity">Quantity to {cartQuantity > 0 ? 'add' : ''}:</label>
            <div className="quantity-controls">
              <button 
                onClick={handleDecreaseQuantity} 
                className="quantity-button"
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(val > 0 ? val : 1);
                }}
                className="quantity-input"
              />
              <button 
                onClick={handleIncreaseQuantity} 
                className="quantity-button"
              >
                +
              </button>
            </div>
          </div>

          <div className="pdp-total">
            <p>Total: <strong>${(product.price * quantity).toFixed(2)}</strong></p>
            {cartQuantity > 0 && (
              <p className="pdp-total-cart">
                New total in cart: <strong>${(product.price * (cartQuantity + quantity)).toFixed(2)}</strong>
              </p>
            )}
          </div>

          <button 
            onClick={handleAddToCart} 
            className="add-to-cart-button"
          >
            {addedToCart ? '✓ Added to Cart!' : cartQuantity > 0 ? `Add ${quantity} More to Cart` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

