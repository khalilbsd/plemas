import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  sidebar: {
    width: "100%",
    height: "100%",
    transition: "all 0.3s ease-in-out",

    "&.opened.showCase": {
      height: "calc(100% - 40px)",
      position: "absolute",
      zIndex: 9999,
      border: "none",
      width: 300
    },
    "& .ps-sidebar-container": {

      display: "flex",
      padding: "10px 0",
      flexDirection: "column",
      borderRadius: 30,
      height:'calc(100% - 20px)',
      background:
        "linear-gradient(0deg,  var(--light-green)  5%, var(--dark-green) 100%)"
    },

    "&.ps-collapsed": {
      width: 60
    },
    "&:not(.ps-collapsed)": {
      height: "100%",
      "& $sidebarHeader": {
        justifyContent: "space-between"
      },
      "& .ps-sidebar-container": {
        padding: 10,
        height: "calc(100% - 20px)",

      },
      "& .bars-icon": {
        fill: "var(--white) !important"
      },
      "& $profile": {
        "& .ps-menu-icon": {
          width: 52,
          height: 52,
          marginRight: 10
        },
        "& .ps-menu-label": {
          display: "block",
          width: "calc(100% - 52px - 10px)"
        }
      },
      "& $profileImageContainer": {
        width: 52,
        height: 52,
        fontSize: 24
      }
    },


  },
  sideBarContent: {
    justifyContent: "space-between",
    display: "flex",
    height: "calc(100% - 40px)",
    flexDirection: "column"
  },

  sidebarHeader: {
    minHeight: 50,

    color: "var(--black)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: "0 10px",
    paddingBottom: 10,
    position: "relative",

    "&:after": {
      content: '""',
      background:
        "linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255), rgba(255, 255, 255, 0)) !important",
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      height: 1
    }
  },
  imageContainer: {
    padding: 5,
    width: 130,
    background: "var(--white)",
    borderRadius: 10,
    "& img": {
      width: "100%"
      // height:'100%'
    }
  },
  bars: {
    padding: 0,

    backgroundColor: "transparent",
    border: "none",
    borderRadius: 10,

    "& .bars-icon": {
      height: 24,
      width: 30,
      fill: "var(--white)",
      "& *": {
        width: "100%",

        height: "100%"
      }
    }
  },
  companyName: {
    fontWeight: "600",
    fontSize: 18
  },
  link: {
    fontWeight: 500,
    color: "var(--white)",
    textTransform: "capitalize",
    "&.logout": {
      textTransform: "none"
    },
    fontSize: 14,
    transition: "0.3s all ease-in-out",
    marginTop: 5,
    "& a": {
      padding: "15px 0",
      borderRadius: "0.75rem",
      transition: "0.3s all ease-in-out"
    },
    "& a:hover": {
      backgroundColor: "var(--light-green) !important",
      borderLeft: "15px solid var(--white)"
    }
  },
  linkIcon: {
    width: 18,
    height: 25,
    fill: "var(--white)"
  },

  profile: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    color: "var(--white)",

    gap: 10,
    "& .name": {
      fontSize: 16,
      fontWeight: 600,
      margin: 0,
      textWrap: "wrap",
      whiteSpace: "normal"
    },
    "& .role": {
      margin: 0,
      fontSize: 14
    },
    "& a": {
      height: "fit-content !important",
      "&:hover": {
        backgroundColor: "transparent !important"
      }
    },

    "& .ps-menu-label": {
      display: "none"
    },
    "& .ps-menu-icon": {
      // border: "3px solid var(--orange)",
      // padding: 3,
      borderRadius: "100%",
      margin: 0
    }
  },
  profileImageContainer: {
    // width:72,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 16,
    backgroundColor: "var(--light-green)",
    height: "100%",
    borderRadius: "100%",
    overflow: "hidden",
    width: 35
  },
  profileImage: {
    height: "100%",
    objectFit: "contain",
    width: "100%"
    // borderRadius: "100%"
  }
});
