import { NavLink } from "react-router-dom";
import {
  IconHomeFilled,
  IconChartDonutFilled,
  IconCreditCardFilled,
  IconCurrencyDollar,
  IconBellFilled,
  IconSettings,
  IconSquareRoundedPlusFilled,
  IconHomeDollar,
  IconCalendar,
  IconWallet,
  IconChartLine, 
  IconMenu2,     
  IconChevronDown, 
  IconChartBar,
  IconLogout,           // <-- Make sure to import this
  IconSwitchHorizontal  // <-- Make sure to import this
} from "@tabler/icons-react";
import { Box, Flex, Text, Button, ActionIcon, Avatar, Menu } from "@mantine/core"; // <-- Import Menu
import classes from "./Navbar.module.css";
import { supabase } from "./supabaseClient"; // <-- Keep this imported

const data = [
  { to: "/", label: "Overview", icon: IconHomeFilled },
  { to: "/add-transaction", label: "Add Transaction", icon: IconSquareRoundedPlusFilled, action: "openModal" },
  { to: "/accounts", label: "All accounts", icon: IconHomeDollar }, 
  { to: "/credit-cards", label: "Credit Cards", icon: IconCreditCardFilled },
  { to: "/statistics", label: "Statistics & Analytics", icon: IconChartDonutFilled },
  { to: "/calendar", label: "Calendar", icon: IconCalendar },
  { to: "/reminders", label: "Bills & Reminders", icon: IconBellFilled },
  { to: "/budget", label: "Budget", icon: IconWallet }, 
  { to: "/transactions", label: "Transactions", icon: IconCurrencyDollar },
  { to: "/settings", label: "Settings", icon: IconSettings },
];

export function Navbar({ onAddTransactionClick }) {
  const links = data.map((item) => {
    if (item.action === "openModal") {
      return (
        <a className={classes.link} href="#" key={item.label} onClick={(event) => { event.preventDefault(); onAddTransactionClick(); }}>
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
        </a>
      );
    }

    return (
      <NavLink to={item.to} key={item.label} className={({ isActive }) => `${classes.link} ${isActive ? classes.active : ""}`}>
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </NavLink>
    );
  });

  return (
    <nav className={classes.navbar}>
      
      {/* HEADER / LOGO */}
      <div className={classes.header}>
        <div className={classes.logoWrapper}>
          <div className={classes.logoIcon}>
            <IconChartLine size={20} stroke={2.5} />
          </div>
          <Text className={classes.logoText}>Tracker</Text>
        </div>
        <ActionIcon variant="subtle" color="gray">
          <IconMenu2 size={20} />
        </ActionIcon>
      </div>

      {/* NAVIGATION LINKS */}
      <div className={classes.navbarMain}>
        <div className={classes.links}>
          {links}
        </div>
      </div>

      {/* FOOTER WIDGETS */}
      <div className={classes.footer}>
        
        {/* Upgrade to Premium Card */}
        <div className={classes.upgradeCard}>
          <IconChartBar size={32} stroke={2} className={classes.upgradeIcon} />
          <Text size="sm" fw={700} c="dark.9" mb={4}>Upgrade to Premium</Text>
          <Text size="xs" c="dimmed" lh={1.3} mb="md">
            Unlock advanced reports, custom categories, and more.
          </Text>
          <Button color="primary" fullWidth radius="md">
            Upgrade Now
          </Button>
        </div>

        {/* NEW: User Profile Menu Dropdown */}
        <Menu shadow="md" width={220} position="top" withArrow>
          <Menu.Target>
            <button className={classes.userProfile}>
              <Flex align="center" gap="sm">
                <Avatar src={null} alt="User" color="primary" radius="xl" size="sm" />
                <Text size="sm" fw={600} c="dark.9" truncate maw={100}>My Account</Text>
              </Flex>
              <IconChevronDown size={16} color="var(--mantine-color-gray-5)" />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<IconSettings size={14} />}>
              Account Settings
            </Menu.Item>
            <Menu.Item leftSection={<IconSwitchHorizontal size={14} />}>
              Change Workspace
            </Menu.Item>
            
            <Menu.Divider />
            
            <Menu.Item 
              color="red" 
              leftSection={<IconLogout size={14} />}
              onClick={async () => {
                await supabase.auth.signOut();
              }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

      </div>
    </nav>
  );
}

export default Navbar;