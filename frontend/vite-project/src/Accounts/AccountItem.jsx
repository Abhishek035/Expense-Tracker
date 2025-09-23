import React from "react";
import { Card, Text, Group, ActionIcon, Switch, Badge } from "@mantine/core";
import {
  IconEye,
  IconDotsVertical,
  IconWallet,
  IconBuildingBank,
  IconCreditCard,
} from "@tabler/icons-react";
import classes from "./AccountItem.module.css";

const getAccountIcon = (type) => {
  switch (type) {
    case "Bank Account":
      return <IconBuildingBank size={24} />;
    case "Debit Card":
      return <IconCreditCard size={24} />;
    case "E-Wallet":
      return <IconWallet size={24} />;
    default:
      return <IconWallet size={24} />;
  }
};

export function AccountItem({ account }) {
  const isArchived = account.status === "archived";

  return (
    <Card
      withBorder
      radius="md"
      className={`${classes.card} ${isArchived ? classes.archived : ""}`}
    >
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <div className={classes.iconWrapper}>
            {getAccountIcon(account.type)}
          </div>
          <div>
            <Text fz="lg" fw={600} className={classes.nickname}>
              {account.nickname}
            </Text>
            <Group gap="xs" align="center" mt={4}>
              <Badge variant="light" size="sm" radius="sm">
                {account.type}
              </Badge>
              {isArchived && (
                 <Badge color="gray" variant="filled" size="sm" radius="sm">
                    Archived
                 </Badge>
              )}
            </Group>
          </div>
        </Group>

        <div className={classes.rightSection}>
          <Text fz="xl" fw={700} className={classes.balance}>
            ₹{account.balance.toLocaleString("en-IN")}
          </Text>
          <Group gap="xs" justify="flex-end" mt={4}>
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label="View account details"
            >
              <IconEye size={18} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" aria-label="More options">
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Group>
        </div>
      </Group>
    </Card>
  );
}