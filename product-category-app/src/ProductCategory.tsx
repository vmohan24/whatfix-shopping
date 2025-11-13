import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Module.css';
import { Product } from './products';
import { fetchProductsByCategory, fetchProductsByCategoryAndSubCategory } from './api';
import ProductDetail from './ProductDetail';
import { useReduxStore } from './useReduxStore';
import { getCategoryTitle, getCategoryPlaceholder } from './helpers/category.helper';
import { DEFAULT_CATEGORY } from './constants/category.constants';

interface ProductCategoryProps {
  category?: string;
}

const ProductCategory = ({ category: categoryProp }: ProductCategoryProps) => {
  const navigate = useNavigate();
  const { category: categoryParam, subCategory: subCategoryParam } = useParams<{ category?: string; subCategory?: string }>();
  const category = categoryParam || categoryProp || DEFAULT_CATEGORY;
  const subCategory = subCategoryParam || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safely use Redux store - will work even if store is not available
  const { storeAvailable, dispatch, cartItems, cartActions } = useReduxStore();

  // Redirect to default category if category is missing from URL
  useEffect(() => {
    if (!categoryParam && !categoryProp) {
      navigate(`/shopping/${DEFAULT_CATEGORY}${subCategory ? `/${subCategory}` : ''}`, { replace: true });
    }
  }, [categoryParam, categoryProp, subCategory, navigate]);

  // Fetch cart on mount only if store is available
  useEffect(() => {
    if (storeAvailable && dispatch && cartActions?.fetchCartAsync) {
      dispatch(cartActions.fetchCartAsync());
    }
  }, [storeAvailable, dispatch, cartActions]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Check if subCategory is numeric (productId) - if so, don't fetch here
        const productIdNum = parseInt(subCategory, 10);
        if (subCategory && !isNaN(productIdNum)) {
          // This is a productId, not a subcategory - don't fetch products
          setLoading(false);
          return;
        }
        
        // Fetch products by category and subcategory if subCategory exists, otherwise by category only
        const fetchedProducts = subCategory 
          ? await fetchProductsByCategoryAndSubCategory(category, subCategory)
          : await fetchProductsByCategory(category);
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setSearchQuery('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, subCategory]);

  // If subCategory is numeric, it's actually a productId - render ProductDetail instead
  const productIdNum = parseInt(subCategory, 10);
  if (subCategory && !isNaN(productIdNum)) {
    return <ProductDetail />;
  }

  const handleProductClick = (productId: number) => {
    const validCategory = category || DEFAULT_CATEGORY;
    navigate(`/shopping/${validCategory}/${productId}`);
  };

  const handleQuantityChange = async (e: React.MouseEvent, productId: number, currentQuantity: number, delta: number) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!storeAvailable || !dispatch || !cartActions) return;
    
    const newQuantity = currentQuantity + delta;
    
    if (newQuantity <= 0) {
      await dispatch(cartActions.removeFromCartAsync(productId));
    } else {
      await dispatch(cartActions.updateCartItemAsync({ productId, quantity: newQuantity }));
    }
  };

  const handleQuantityInputChange = async (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!storeAvailable || !dispatch || !cartActions) return;
    
    const val = parseInt(e.target.value) || 0;
    
    if (val <= 0) {
      await dispatch(cartActions.removeFromCartAsync(productId));
    } else {
      await dispatch(cartActions.updateCartItemAsync({ productId, quantity: val }));
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!storeAvailable || !dispatch || !cartActions) return;
    
    await dispatch(cartActions.addToCartAsync({ productId, quantity: 1 }));
  };

  const getCartQuantity = (productId: number): number => {
    const cartItem = cartItems.find((item: { product: { id: number }; quantity: number }) => item.product.id === productId);
    return cartItem?.quantity ?? 0;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="clothing-container">
        <div className="products-container">
          <div className="no-results">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clothing-container">
        <div className="products-container">
          <div className="no-results">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="clothing-container">
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder={getCategoryPlaceholder(category)}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      
      <div className="products-container">
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const cartQuantity = storeAvailable ? getCartQuantity(product.id) : 0;
              const isInCart = cartQuantity > 0;
              
              return (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="product-image">{product.image}</div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    
                    {storeAvailable && isInCart ? (
                      <div className="product-cart-controls" onClick={(e) => e.stopPropagation()}>
                        <span className="product-cart-label">In cart:</span>
                        <div className="product-quantity-controls">
                          <button
                            onClick={(e) => handleQuantityChange(e, product.id, cartQuantity, -1)}
                            className="product-quantity-button"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={cartQuantity}
                            onChange={(e) => handleQuantityInputChange(e, product.id)}
                            className="product-quantity-input"
                            aria-label="Quantity"
                          />
                          <button
                            onClick={(e) => handleQuantityChange(e, product.id, cartQuantity, 1)}
                            className="product-quantity-button"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : storeAvailable && (
                      <button
                        className="product-add-to-cart-button"
                        onClick={(e) => handleAddToCart(e, product.id)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <p>No products found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;

