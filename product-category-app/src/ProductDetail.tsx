import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Module.css';
import { Product } from './products';
import { fetchProductById, fetchProductsByCategoryAndSubCategory } from './api';
import { useReduxStore } from './useReduxStore';
import { getCategoryPath } from './helpers/category.helper';
import { DEFAULT_CATEGORY } from './constants/category.constants';

const ProductDetail = () => {
  const { category, productId, subCategory } = useParams<{ category: string; productId?: string; subCategory?: string }>();
  const actualProductId = productId || subCategory;
  const navigate = useNavigate();
  
  // Safely use Redux store - will work even if store is not available
  const { storeAvailable, dispatch, cartItems, cartActions } = useReduxStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    if (storeAvailable && dispatch && cartActions?.fetchCartAsync) {
      dispatch(cartActions.fetchCartAsync());
    }
  }, [storeAvailable, dispatch, cartActions]);

  // Redirect to default category if category is missing from URL
  useEffect(() => {
    if (!category && actualProductId) {
      navigate(`/shopping/${DEFAULT_CATEGORY}/${actualProductId}`, { replace: true });
    } else if (!category) {
      navigate(`/shopping/${DEFAULT_CATEGORY}`, { replace: true });
    }
  }, [category, actualProductId, navigate]);

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

  // Load similar products when product is loaded
  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (!product || !category) {
        setSimilarProducts([]);
        return;
      }

      try {
        setLoadingSimilar(true);
        // Fetch all products in the same category and subcategory
        const allProductsInSubCategory = await fetchProductsByCategoryAndSubCategory(
          category,
          product.subCategory
        );
        
        // Filter out the current product
        const similar = allProductsInSubCategory.filter(p => p.id !== product.id);
        setSimilarProducts(similar);
      } catch (err) {
        console.error('Error loading similar products:', err);
        setSimilarProducts([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    loadSimilarProducts();
  }, [product, category]);

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!product || !storeAvailable || !dispatch || !cartActions) return;

    try {
      const productIdNum = parseInt(actualProductId || '', 10);
      if (isNaN(productIdNum)) {
        throw new Error('Invalid product ID');
      }

      if (cartQuantity > 0) {
        await dispatch(cartActions.updateCartItemAsync({ 
          productId: productIdNum, 
          quantity: cartQuantity + quantity 
        }));
      } else {
        await dispatch(cartActions.addToCartAsync({ 
          productId: productIdNum, 
          quantity 
        }));
      }

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      if (cartActions.fetchCartAsync) {
        dispatch(cartActions.fetchCartAsync());
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
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

          {storeAvailable && cartQuantity > 0 && (
            <div className="pdp-cart-info">
              <p>Currently in cart: {cartQuantity} {cartQuantity === 1 ? 'item' : 'items'}</p>
            </div>
          )}

          {storeAvailable ? (
            <>
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
            </>
          ) : (
            <div className="pdp-cart-unavailable" style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.9em', color: '#666', fontStyle: 'italic', margin: 0 }}>
                Cart functionality is unavailable in standalone mode. Please use the main application to add items to cart.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Items Section */}
      {similarProducts.length > 0 && (
        <div className="pdp-similar-section">
          <h2 className="pdp-similar-title">Similar Items</h2>
          <div className="pdp-similar-grid">
            {similarProducts.map((similarProduct) => {
              return (
                <div
                  key={similarProduct.id}
                  className="pdp-similar-card"
                  onClick={() => navigate(`/shopping/${category}/${similarProduct.id}`)}
                >
                  <div className="pdp-similar-image">{similarProduct.image}</div>
                  <div className="pdp-similar-info">
                    <h3 className="pdp-similar-name">{similarProduct.name}</h3>
                    <p className="pdp-similar-price">${similarProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

