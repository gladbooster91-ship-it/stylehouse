import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Eye, CheckCircle2 } from 'lucide-react';
import { ClothingProduct } from '../types';
import { FORMAT_NUMBER } from '../data/products';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: ClothingProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openActivationModal, setSelectedProductForDetail, activatedProducts } = useApp();

  const isActivated = activatedProducts.some(
    p => p.productId === product.id && p.status === 'active'
  );

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between p-4 sm:p-5"
    >
      {/* Top Image Preview */}
      <div className="relative h-52 sm:h-56 rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
        <img
          src={product.imageUrl}
          alt={product.fullName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 text-[10px] font-bold tracking-wide uppercase">
            HD Edition
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase">
            {product.durationDays} DAYS
          </span>
        </div>

        {/* Quick View Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProductForDetail(product);
          }}
          className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-xs transition-all cursor-pointer backdrop-blur-md"
          title="View HD Details & Fabric"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Financials & Header */}
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col mb-3">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
            Tier {product.vipTier}: {product.name}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {product.fullName}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {product.tagline}
          </p>
        </div>

        {/* Space-y-2 list pattern from Design HTML */}
        <div className="space-y-2 border-t border-slate-100 pt-3 mb-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Price</span>
            <span className="font-bold text-slate-900">{FORMAT_NUMBER(product.priceUGX)} UGX</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Daily Return</span>
            <span className="text-green-600 font-bold">+{FORMAT_NUMBER(product.dailyIncomeUGX)} UGX</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Duration</span>
            <span className="text-slate-600 font-medium">{product.durationDays} Days</span>
          </div>
        </div>

        {/* Footer CTA & Total Payout */}
        <div className="pt-3 border-t border-slate-100 flex flex-col">
          <div className="text-center mb-3">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
              TOTAL PAYOUT
            </span>
            <span className="text-sm font-black text-slate-900">
              {FORMAT_NUMBER(product.totalPayoutUGX)} UGX
            </span>
          </div>

          <button
            onClick={() => openActivationModal(product)}
            id={`activate-btn-${product.id}`}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>Activate Product</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
