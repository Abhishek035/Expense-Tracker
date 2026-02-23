import React from 'react';
import { Carousel } from '@mantine/carousel';
import { Card, Text, Group, Box, Center } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './Cards.module.css';

// Sample data for the cards
const cardData = [
  {
    id: 1,
    type: 'Credit',
    name: 'Marvin McKinney',
    number: '5242 - 4343 - 8348 - 4878',
    bank: 'Chase Bank'
  },
  {
    id: 2,
    type: 'Debit',
    name: 'Sarah Johnson',
    number: '4532 - 1234 - 5678 - 9012',
    bank: 'Wells Fargo'
  },
  {
    id: 3,
    type: 'Credit',
    name: 'Michael Chen',
    number: '3456 - 7890 - 1234 - 5678',
    bank: 'Bank of America'
  }
];

const Cards = () => {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Group justify="space-between" mb="md" px="md" pt="sm">
        <Text size="lg" fw={600} c="dark.9">
          My cards
        </Text>
        <Text size="sm" c="dimmed" style={{ cursor: 'pointer', fontWeight: 'bold' }}>
          •••
        </Text>
      </Group>

      {/* Carousel Section */}
      <Box className={styles.carouselContainer}>
        <Carousel
          withIndicators
          height="100%"
          slideGap="md"
          align="start"
          classNames={{
            root: `${styles.carouselRoot} ${styles.root}`,
            container: styles.carouselSlideContainer,
            indicators: styles.indicators,
            indicator: styles.indicator,
            control: styles.control, // Hides the default arrow controls
            controls: styles.controls
          }}
        >
          {cardData.map((card) => (
            <Carousel.Slide key={card.id}>
              <Card className={styles.creditCard} p="lg" radius="lg">
                <Group justify="space-between" mb="xl">
                  <Text size="sm" c="white" fw={500}>
                    {card.type}
                  </Text>
                  <Box className={styles.cardChip}></Box>
                </Group>
                
                <Box>
                  <Text size="xl" c="white" fw={600} mb="xs">
                    {card.name}
                  </Text>
                  
                  <Text size="md" c="white" fw={500} style={{ letterSpacing: '0.15em' }}>
                    {card.number}
                  </Text>
                </Box>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>

        {/* Add New Card Button */}
        <Center className={styles.addCardContainer}>
          <Box className={styles.addCard}>
            <FontAwesomeIcon icon={faPlus} />
          </Box>
        </Center>
      </Box>
    </div>
  );
};

export default Cards;