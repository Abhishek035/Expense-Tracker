import { NavLink } from "react-router-dom";
import {
  Icon2fa,
  IconHomeFilled,
  IconChartDonutFilled,
  IconCreditCardFilled,
  IconLogout,
  IconCurrencyDollar,
  IconSettings,
  IconSwitchHorizontal,
  IconSquareRoundedPlusFilled,
  IconHomeDollar,
} from "@tabler/icons-react";
import { Group } from "@mantine/core";
import classes from "./Navbar.module.css";

const data = [
  { to: "/", label: "Overview", icon: IconHomeFilled },
  {
    to: "/add-transaction",
    label: "Add Transaction",
    icon: IconSquareRoundedPlusFilled,
    action: "openModal",
  },
  { to: "/accounts", label: "All accounts", icon: IconHomeDollar }, // <-- This is our new route
  { to: "/credit-cards", label: "Credit Cards", icon: IconCreditCardFilled },
  { to: "/statistics", label: "Statistics", icon: IconChartDonutFilled },
  { to: "/transactions", label: "Transactions", icon: IconCurrencyDollar },
  { to: "/settings", label: "Other Settings", icon: IconSettings },
];

export function Navbar({ onAddTransactionClick }) {

  const links = data.map((item) => {
    // If the item is just for opening a modal, render it as a button-like <a> tag
    if (item.action === "openModal") {
      return (
        <a
          className={classes.link}
          href="#"
          key={item.label}
          onClick={(event) => {
            event.preventDefault();
            onAddTransactionClick();
          }}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
        </a>
      );
    }

    // Otherwise, render a NavLink for actual navigation
    return (
      <NavLink
        to={item.to}
        key={item.label}
        className={({ isActive }) =>
          `${classes.link} ${isActive ? classes.active : ""}`
        }
        // The above line combines the base class with an 'active' class if the link matches the URL
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </NavLink>
    );
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          Tracker
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
