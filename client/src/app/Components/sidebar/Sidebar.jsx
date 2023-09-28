import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import Logo from "../../public/images/logo.webp";
import { protectedUrls } from "../../routes/urls";
import { styles } from "./style";
import faUser from "../../public/svgs/light/user.svg";
import faLogout from "../../public/svgs/light/right-from-bracket.svg";
import { ReactSVG } from "react-svg";

const SidebarComponent = () => {
  const classes = styles();
  const [collapse, setCollapse] = useState(true);

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <Sidebar
      breakPoint="md"
      className={classes.sidebar}
      collapsed={collapse}
      onBackdropClick={handleCollapse}
    >
      <div className={classes.sideBardTop}>
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
        <Menu>
          {protectedUrls.map(({ title, path, icon, nested }, key) =>
            !nested ? (
              <MenuItem
                key={key}
                className={classes.link}
                icon={<ReactSVG src={icon} className={classes.linkIcon} />}
                component={<Link to={path} />}
              >
                {title}
              </MenuItem>
            ) : (
              <SubMenu
              key={key}
                icon={<ReactSVG src={icon} className={classes.linkIcon} />}
                className={classes.link}
                label={title}
              >
                {nested.map((nest, idx) => (
                  <MenuItem
                    key={idx}
                    className={classes.link}
                    icon={
                      <ReactSVG src={nest.icon} className={classes.linkIcon} />
                    }
                    component={<Link to={nest.path} />}
                  >
                    {nest.title}
                  </MenuItem>
                ))}
              </SubMenu>
            )
          )}
        </Menu>
      </div>
      <div className={classes.sideBardBottom}>
        <Menu>
          <MenuItem
            className={classes.link}
            icon={<ReactSVG src={faLogout} className={classes.linkIcon} />}
            component={<Link to="/logout" />}
          >
            logout
          </MenuItem>
        </Menu>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
