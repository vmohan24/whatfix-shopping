import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Module.css';
import { Product } from './products';
import { fetchProductById } from './api';

interface CartItem {
  product: Product;
  quantity: number;
}

const getCart = (): CartItem[] => {
  const cartData = localStorage.getItem('shopping_cart');
  return cartData ? JSON.parse(cartData) : [];
};

const saveCart = (cart: CartItem[]) => {
  localStorage.setItem('shopping_cart', JSON.stringify(cart));
};

const addToCart = (product: Product, quantity: number) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  
  saveCart(cart);
};

const ProductDetail = () => {
  const { category, productId, subCategory } = useParams<{ category: string; productId?: string; subCategory?: string }>();
  // Use productId if available, otherwise use subCategory (when it's numeric)
  const actualProductId = productId || subCategory;
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
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

          <div className="pdp-quantity-section">
            <label htmlFor="quantity">Quantity:</label>
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
          </div>

          <button 
            onClick={handleAddToCart} 
            className="add-to-cart-button"
          >
            {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

