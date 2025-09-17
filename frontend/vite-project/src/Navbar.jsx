import { useState } from 'react';
import {
  Icon2fa,
  IconHomeFilled,
  IconChartDonutFilled,
  IconCreditCardFilled,
  IconLogout,
  IconCurrencyDollar,
  IconSettings,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import { Group } from '@mantine/core';
import classes from './Navbar.module.css';

const data = [
  { link: '', label: 'Overview', icon: IconHomeFilled },
  { link: '', label: 'Cards', icon: IconCreditCardFilled },
  { link: '', label: 'Statistics', icon: IconChartDonutFilled },
  { link: '', label: 'Transactions', icon: IconCurrencyDollar },
  { link: '', label: 'Other Settings', icon: IconSettings },
];

export function Navbar() {
  const [active, setActive] = useState('Overview');

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          Tracker
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;