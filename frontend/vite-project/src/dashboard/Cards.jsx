import React from 'react';
import { Carousel } from '@mantine/carousel';

const Cards = () => {
  return (
    <Carousel
      withIndicators
      height={200}
      emblaOptions={{ loop: true }}
      // Use the classNames prop to target internal elements
      classNames={{
        // Target the indicators container
        indicators: 'mb-4',
        // Target an individual indicator button
        indicator: 'w-4 h-4 bg-gray-300 data-[active=true]:bg-blue-500',
        // Target the main controls container
        controls: 'text-blue-500',
        // Target the individual control buttons (next/prev)
        control: 'bg-white/50 hover:bg-white/80 text-blue-700 border-blue-700',
      }}
    >
      <Carousel.Slide className="bg-primary flex items-center justify-center text-2xl font-bold">1</Carousel.Slide>
      <Carousel.Slide className="bg-primary flex items-center justify-center text-2xl font-bold">2</Carousel.Slide>
      <Carousel.Slide className="bg-primary flex items-center justify-center text-2xl font-bold">3</Carousel.Slide>
    </Carousel>
  );
}

export default Cards;