import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import Logo from "../../public/images/logo.webp";
import { protectedUrls } from "../../routes/urls";
import { styles } from "./style";

const SidebarComponent = () => {
  const classes = styles();
  const [collapse, setCollapse] = useState(true);

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <Sidebar breakPoint="md" className={classes.sidebar} collapsed={collapse}
    onBackdropClick={handleCollapse}
    >
      <div className={classes.sidebarHeader}>
        {!collapse && (
          <>
            <img src={Logo} alt="logo" />
            <p className={classes.companyName}>Midgard Enginering</p>
          </>
        )}
        <button onClick={handleCollapse} className={classes.bars}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <Menu
        menuItemStyles={{
        //   button: ({ level, active, disabled }) => {
        //     // only apply styles on first level elements of the tree
        //     if (level === 0)
        //       return {
        //         color: disabled ? "#f5d9ff" : "#d359ff",
        //         backgroundColor: active ? "red" : undefined
        //       };
        //   }
        }}
      >
        {protectedUrls.map(({ title, path,icon }, key) => (
          <MenuItem key={key} className={classes.link} icon={ <FontAwesomeIcon className={classes.linkIcon} icon={icon} />} component={<Link to={path} />}>
            {title}
          </MenuItem>
        ))}
          <MenuItem className={classes.link} icon={ <FontAwesomeIcon className={classes.linkIcon} icon={faRightFromBracket} />}  component={<Link to="/logout" />}>
            logout
          </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;
