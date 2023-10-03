import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  resetPasswordPage: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    '& button':{
        backgroundColor:'------',
        borderRadius:5,
        height:50,
        width:'100%',
        border:'none',
        fontSize:14,
        fontWeight:600
    }
},

  box: {
    width: 500,
    backgroundColor: "white",
    border: "1px solid lightgrey",
    borderRadius: 10,
    padding: 40,
    textAlign: "center"
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center"
  },
  text: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 30
  },
  imageContainer: {
    width: 200,
    margin: "10px auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  notificationIcon: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: 150,
    width: 150,
    alignItems: "center",
    borderRadius: "100%",
    "& svg": {
      width: "100%"
    },
    "&.success": {
      // background:'#21bf62',
      fill: "#21bf62"
    },
    "&.failed": {
      fill: "red"
    }
  }
});
