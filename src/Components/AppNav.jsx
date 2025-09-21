import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";
function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="cities">Cities</NavLink>
        </li>
        <li>
          <NavLink to="countries">countries</NavLink>
        </li>
        {/* <li>
          <NavLink to="form">form</NavLink>
        </li> */}
      </ul>
    </nav>
  );
}

export default AppNav;
