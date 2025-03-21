
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Product, formatPrice } from "../utils/data";
import { useCart } from "../contexts/CartContext";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-subtle hover-lift"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <Link
              to={`/product/${product.id}`}
              className="bg-white/90 backdrop-blur-xs hover:bg-white text-foreground rounded-full p-2 transition-colors"
            >
              <Eye size={18} />
            </Link>
            
            <button
              onClick={() => addToCart(product)}
              className="bg-primary text-white hover:bg-primary/90 rounded-full p-2 transition-colors ml-2"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          {product.category}
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex justify-between items-center">
          <p className="font-semibold text-foreground">
            {formatPrice(product.price)}
          </p>
          
          <div className="flex items-center">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm ml-1">{product.rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
