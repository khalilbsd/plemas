import React, { useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import Logo from "../../public/svgs/Kairos logo_3.svg";
import { getRolesBasedUrls } from "../../routes/urls";
import { styles } from "./style";

import { ReactSVG } from "react-svg";
import { SUPERUSER_ROLE } from "../../../constants/roles";
import useGetUserInfo from "../../../hooks/user";
import faBars from "../../public/svgs/light/bars.svg";
import faLogout from "../../public/svgs/light/right-from-bracket.svg";
const SidebarComponent = () => {
  const classes = styles();
  const [collapse, setCollapse] = useState(true);
  const [hovered, setHovered] = useState(false);
  const user = useGetUserInfo();
  let hoverTimeout;
  let leaveTimeout;
  let removeHoverExecuted = false;
  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  const handleAddHover = () => {
    clearTimeout(hoverTimeout);
    clearTimeout(leaveTimeout);

    hoverTimeout = setTimeout(
      () => {
        setHovered(true);
        handleCollapse();
      },
      removeHoverExecuted ? 500 : 0
    );
  };

  const handleRemoveHover = () => {
    removeHoverExecuted = true; // set flag that handleRemoveHover has executed
    clearTimeout(hoverTimeout);
    clearTimeout(leaveTimeout);
    leaveTimeout = setTimeout(() => {
      setHovered(false);
      handleCollapse();
    }, 500);
  };

  return (
    <Sidebar
      breakPoint="md"
      className={`${classes.sidebar} ${collapse ? "collapsed" : "opened"} ${
        hovered ? "showCase" : ""
      }`}
      collapsed={collapse}
      onBackdropClick={handleCollapse}
    >
      <div className={classes.sidebarHeader}>
        {!collapse && (
          <>
            <div className={classes.imageContainer}>
              <img src={Logo} alt="logo" />
            </div>

            {/* <p className={classes.companyName}>Chronos</p> */}
          </>
        )}
        <button onClick={handleCollapse} className={classes.bars}>
          <ReactSVG src={faBars} className="bars-icon" />
        </button>
      </div>

      <div
        className={classes.sideBarContent}
        onMouseEnter={collapse || hovered ? handleAddHover : null}
        onMouseLeave={collapse || hovered ? handleRemoveHover : null}
      >
        <div className={classes.sideBardTop}>
          <Menu>
            <MenuItem
              icon={
                <div className={classes.profileImageContainer}>
                  {user?.profile?.image ? (
                    <img
                      src={`${process.env.REACT_APP_SERVER_URL}${user?.profile?.image}`}
                      className={classes.profileImage}
                      alt="user avatar"
                    />
                  ) : (
                    <span className="initials">
                      {user?.profile?.name[0]}
                      {user?.profile?.lastName[0]}
                    </span>
                  )}
                </div>
              }
              className={classes.profile}
              component={<Link to="/profile/me" />}
            >
              <div className={classes.username}>
                <h3 className="name">
                  {user?.profile?.name} {user?.profile?.lastName}
                </h3>
                <p className="role">
                  {user?.user?.role === SUPERUSER_ROLE
                    ? "admin"
                    : user?.user?.role}
                </p>
              </div>
            </MenuItem>

            {user.user &&
              getRolesBasedUrls(user?.user).map(
                ({ title, path, icon, sideBar }, key) =>
                  sideBar && (
                    <MenuItem
                      key={key}
                      className={classes.link}
                      icon={
                        <ReactSVG src={icon} className={classes.linkIcon} />
                      }
                      component={<Link to={path} />}
                    >
                      {title}
                    </MenuItem>
                  )
              )}
          </Menu>
        </div>
        <div className={classes.sideBardBottom}>
          <Menu>
            <MenuItem
              className={`${classes.link} logout`}
              icon={<ReactSVG src={faLogout} className={classes.linkIcon} />}
              component={<Link to="/logout" />}
            >
              Se déconnecté
            </MenuItem>
          </Menu>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
