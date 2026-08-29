import React, { useState } from 'react';
import { Sparkles, Search, SlidersHorizontal, ShieldCheck, Clock, Layers, TrendingUp } from 'lucide-react';
import { CLOTHING_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { useApp } from '../context/AppContext';

export const ProductsTab: React.FC = () => {
  const { activatedProducts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'income-desc'>('default');

  const categories = [
    { id: 'all', label: 'All Catalog (8)' },
    { id: 'starter', label: 'Starter (25K - 100K)' },
    { id: 'vip', label: 'VIP (150K - 500K)' },
    { id: 'signature', label: 'Royal & 1M+ Signature' },
  ];

  // Filtering & Sorting
  const filteredProducts = CLOTHING_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'starter') return product.priceUGX <= 100000;
    if (selectedCategory === 'vip') return product.priceUGX > 100000 && product.priceUGX <= 500000;
    if (selectedCategory === 'signature') return product.priceUGX >= 1000000;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceUGX - b.priceUGX;
    if (sortBy === 'price-desc') return b.priceUGX - a.priceUGX;
    if (sortBy === 'income-desc') return b.dailyIncomeUGX - a.dailyIncomeUGX;
    return 0;
  });

  const totalActive = activatedProducts.filter(p => p.status === 'active').length;

  return (
    <div className="pb-28 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Header Section from Design Pattern */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
            StyleHouse Uganda Official Catalog
          </div>

          <h2 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-tight">
            Clothing <span className="font-bold text-slate-900">Catalog</span>
          </h2>

          <p className="text-sm text-slate-500 font-normal leading-relaxed max-w-2xl">
            High-definition product inventory. Activation yields daily income starting in 24 hours.
          </p>

          {/* Quick Features Row */}
          <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">45-Day Fixed Term</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Instant Daily UGX Claims</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">MTN & Airtel Direct</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clothing lines (e.g. Amethyst, Empress, Queen)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-600 shadow-xs cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="income-desc">Daily Income: Highest</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Catalog Grid (All 8 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3 shadow-xs">
          <p className="text-slate-500 text-sm">No products found matching your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
