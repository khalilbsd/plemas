
import minimist from "minimist"
import { invalid } from "moment";



const argv = process.argv.slice(2)


const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };



if (argv.length < 3 ) {
    console.log('invalid number of paramters')
}else{
    // console.log()
    if (!validateEmail(argv[0])) {
        console.log("invalid email")
    }else{
        // creatuing super user
        let email = argv[0]
        let password = argv[1]
        let name= argv[2]
        let lastName= argv[3]

    }
}


