import React from 'react';
import { Card, Text, Group } from '@mantine/core';
import classes from './index.module.css';

export const ListItem = React.forwardRef(
  ({ icon, title, badges, mainValue, actions, isDimmed = false, dragHandle, ...props }, ref) => {
    return (
      <Card
        withBorder
        radius="md"
        className={`${classes.card} ${isDimmed ? classes.dimmed : ''}`}
        ref={ref}
        {...props}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group align="center" wrap="nowrap">
            {dragHandle}
            {icon && <div className={classes.iconWrapper}>{icon}</div>}
            <div>
              <Text fz="lg" fw={600} className={classes.title}>
                {title}
              </Text>
              {badges && <Group gap="xs" align="center" mt={4}>{badges}</Group>}
            </div>
          </Group>

          <div className={classes.rightSection}>
            <Text fz="xl" fw={700} className={classes.mainValue}>
              {mainValue}
            </Text>
            {actions && <Group gap="xs" justify="flex-end" mt={4}>{actions}</Group>}
          </div>
        </Group>
      </Card>
    );
  }
);
