import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  uploaderForm: {
    position: "relative"
  },
  uploadContainer: {
    height: 400,
    border: "7px dashed #EDC697",
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    transition: "all 0.3s ease-in-out",
    marginBottom: 5,
    "&:hover": {
      borderColor: "#EFE7DE"
    }
  },
  btnFileInput: {
    height: 60,
    margin: "auto",
    width: 150,
    background: "#EDC697",
    color: "white",
    border: "none",
    borderRadius: 5,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  ctaBtn: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    display: "flex",
    "& button": {
      backgroundColor: "white",
      width: "100%",
      height: 50,
      opacity: 0.7,
      fontSize: 16,
      fontWeight: 600,
      border: "none",
      transition: "0.3s all ease-in-out",
      "&.br": {
        borderRight: "1px solid grey"
      },
      "&:hover": {
        opacity: 0.5
      }
    }
  },
  loader: {
    position: "absolute",
    // top:'50%'
    margin: "auto",
    top: "45%",
    bottom: "45%",
    left: "45%",
    right: "45%"
  },
  blur:{
    opacity:0.5
  },
  profileImage:{
    borderRadius:8
  }
});
