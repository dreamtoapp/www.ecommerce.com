import React from 'react';

import ServerCarousel from './ServerCarousel';

interface Promotion {
  id: string;
  name: string; // Changed from title to name to match Offer model
  description?: string | null;
  imageUrl?: string | null;
  discountPercentage?: number | null; // Changed to match Offer model
  isActive?: boolean; // Changed to match Offer model
}

interface PromotionSliderProps {
  promotions: Promotion[];
}

const SliderSection: React.FC<PromotionSliderProps> = ({ promotions }) => {
  // If no promotions, don't render the section
  if (!promotions || promotions.length === 0) {
    return null;
  }

  // Transform offers to the format expected by ServerCarousel
  const carouselItems = promotions.map((offer) => ({
    id: offer.id,
    url: offer.imageUrl || '/fallback/fallback.avif',
    alt: offer.name,
    title: offer.name,
    description: offer.description || undefined,
    discountValue: offer.discountPercentage,
    discountType: 'percentage',
    linkUrl: `/offers/${encodeURIComponent(offer.name.toLowerCase().replace(/ /g, '-'))}-${offer.id}`,
  }));

  return (
    <section className='relative px-4 py-8'>
      <div className='container mx-auto max-w-full'>
        <ServerCarousel images={carouselItems} className='overflow-hidden rounded-xl shadow-lg' />
      </div>
    </section>
  );
};

export default SliderSection;
