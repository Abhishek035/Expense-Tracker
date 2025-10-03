import React from "react";
import { Card, Text, Group, Badge, ActionIcon, Menu } from "@mantine/core";
import {
  IconCreditCard,
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
  IconGripVertical,
} from "@tabler/icons-react";
import classes from "./CreditItem.module.css";

export const CreditItem = React.forwardRef(
  ({ account, onEdit, onDelete, style, dragAttributes, dragListeners, ...props }, ref) => {
    return (
      <Card
        withBorder
        radius="md"
        className={classes.card}
        ref={ref}
        style={style}
        {...props}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          {/* Drag Handle and Left Section */}
          <Group align="center" wrap="nowrap">
            <div
              className={classes.dragHandle}
              {...dragAttributes}
              {...dragListeners}
            >
              <IconGripVertical size={20} stroke={1.5} />
            </div>
            <Group align="flex-start" wrap="nowrap">
              <div className={classes.iconWrapper}>
                <IconCreditCard size={28} />
              </div>
              <div>
                <Text fz="lg" fw={600} className={classes.nickname}>
                  {account.nickname}
                </Text>
                <Text fz="sm" c="dimmed">
                  {account.provider}{" "}
                  {account.last4 ? `• • • • ${account.last4}` : ""}
                </Text>
                <Group gap="xs" mt="sm">
                  <Badge variant="light" color="primary" size="sm" radius="sm">
                    {account.accountType}
                  </Badge>
                  {account.network && (
                    <Badge variant="light" color="gray" size="sm" radius="sm">
                      {account.network}
                    </Badge>
                  )}
                </Group>
              </div>
            </Group>
          </Group>

          {/* Right Section */}
          <div className={classes.rightSection}>
            <Text fz="xl" fw={600} className={classes.amount}>
              ₹{account.amount}
            </Text>
            <Group gap="xs" justify="flex-end" mt={4} wrap="nowrap">
              <ActionIcon variant="subtle" color="gray" aria-label="View Details">
                <IconEye size={18} />
              </ActionIcon>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    aria-label="More options"
                  >
                    <IconDotsVertical size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={onEdit}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    onClick={onDelete}
                    color="red"
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </div>
        </Group>
      </Card>
    );
  }
);