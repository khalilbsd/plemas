import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import Logo from "../../public/svgs/Kairos logo_3.svg";
import { getRolesBasedUrls, protectedUrls } from "../../routes/urls";
import { styles } from "./style";

import faLogout from "../../public/svgs/light/right-from-bracket.svg";
import { ReactSVG } from "react-svg";
import useGetAuthenticatedUser from "../../../hooks/authenticated";
import useGetUserInfo from "../../../hooks/user";
import faUser from "../../public/svgs/light/user.svg";
import faBars from "../../public/svgs/light/bars.svg";
const SidebarComponent = () => {
  const classes = styles();
  const [collapse, setCollapse] = useState(false);
  const user = useGetUserInfo();
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
            <div className={classes.imageContainer} >
              <img src={Logo} alt="logo" />
            </div>

              {/* <p className={classes.companyName}>Chronos</p> */}
            </>
          )}
          <button onClick={handleCollapse} className={classes.bars}>
            <ReactSVG src={faBars} className="bars-icon" />
          </button>
        </div>
        {/* <div className={classes.profile}>
          <div className={classes.profileImageContainer}>
          <img
                src={`${process.env.REACT_APP_SERVER_URL}${user?.profile?.image}`}
                className={classes.profileImage}
              />
          </div>
          <div className={classes.username}>
            <h3 className="name">
            {user?.profile?.name} {user?.profile?.lastName}
            </h3>
            <p className="role">
              {user?.user?.role}
            </p>
          </div>
        </div> */}
        <Menu>
          <MenuItem
            icon={
              <div className={classes.profileImageContainer}>
                {user?.profile?.image?<img
                  src={`${process.env.REACT_APP_SERVER_URL}${user?.profile?.image}`}
                  className={classes.profileImage}
                />
                :

                  <span className="initials">{user?.profile?.name[0]}{user?.profile?.lastName[0]}</span>}
              </div>
            }
            className={classes.profile}
            component={<Link to="/profile/me" />}
          >
            <div className={classes.username}>
              <h3 className="name">
                {user?.profile?.name} {user?.profile?.lastName}
              </h3>
              <p className="role">{user?.user?.role}</p>
            </div>
          </MenuItem>

          {user.user &&
            getRolesBasedUrls(user?.user).map(
              ({ title, path, icon, sideBar }, key) =>
                sideBar && (
                  <MenuItem
                    key={key}
                    className={classes.link}
                    icon={<ReactSVG src={icon} className={classes.linkIcon} />}
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
