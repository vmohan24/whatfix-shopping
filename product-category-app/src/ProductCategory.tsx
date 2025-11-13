import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Module.css';
import { Product } from './products';
import { fetchProductsByCategory, fetchProductsByCategoryAndSubCategory } from './api';
import ProductDetail from './ProductDetail';

interface ProductCategoryProps {
  category?: string;
}

const getCategoryTitle = (category?: string): string => {
  switch (category) {
    case 'electronics':
      return 'Electronics';
    case 'mobiles':
      return 'Mobiles';
    case 'clothing':
    default:
      return 'Clothing';
  }
};

const getCategoryPlaceholder = (category?: string): string => {
  switch (category) {
    case 'electronics':
      return 'Search for electronic items...';
    case 'mobiles':
      return 'Search for mobile phones...';
    case 'clothing':
    default:
      return 'Search for clothing items...';
  }
};

const ProductCategory = ({ category: categoryProp }: ProductCategoryProps) => {
  const navigate = useNavigate();
  const { category: categoryParam, subCategory: subCategoryParam } = useParams<{ category?: string; subCategory?: string }>();
  const category = categoryParam || categoryProp || '';
  const subCategory = subCategoryParam || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    navigate(`/shopping/${category}/${productId}`);
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
            {filteredProducts.map((product) => (
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
                </div>
              </div>
            ))}
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

