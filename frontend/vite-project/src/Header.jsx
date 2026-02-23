import { IconSearch } from "@tabler/icons-react";
import {
  createTheme,
  Autocomplete,
  Burger,
  Group,
  MantineProvider,
  Avatar,
  Text,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Switch } from "@mantine/core";
import { IconSun, IconMoonStars, IconBellFilled } from "@tabler/icons-react";
import classes from "./Header.module.css";

const theme = createTheme({
  cursorType: "pointer",
});

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Autocomplete
          className={classes.search}
          placeholder="Search for..."
          leftSection={<IconSearch size={16} stroke={1.5} />}
          visibleFrom="xs"
          autoSelectOnBlur
          clearable
          comboboxProps={{
            transitionProps: { transition: "pop", duration: 200 },
            shadow: "md",
          }}
          data={[
            "Transactions",
            "Expenses",
            "Income",
            "Savings",
            "Reports",
            "Settings",
          ]}
          classNames={{
            input: classes.input,
            option: classes.option,
          }}
        />
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </Group>
        <Group>
          <MantineProvider theme={theme}>
            <Switch
              size="md"
              onLabel={
                <IconMoonStars
                  size={16}
                  stroke={2.5}
                  color="var(--mantine-color-gray-4)"
                />
              }
              offLabel={
                <IconSun
                  size={16}
                  stroke={2.5}
                  color="var(--mantine-color-primary-6)"
                />
              }
              style={{ cursor: "pointer" }}
            />
          </MantineProvider>
          <IconBellFilled
            size={20}
            stroke={1.5}
            className="hover:cursor-pointer"
          />
          <Group className={classes.avatarGroup}>
            <Avatar
              src="avatar.png"
              alt="Marvin McKinney"
              radius="xl"
              style={{ cursor: "pointer" }}
            />
            <Stack gap={0} className={classes.userInfo}>
              <Text size="sm" fw={500} className={classes.userName}>
                Temp User
              </Text>
              <Text size="xs" c="dimmed" className={classes.userRole}>
                Free Tier
              </Text>
            </Stack>
          </Group>
        </Group>
      </div>
    </header>
  );
}