import database from "../../db/db.js";

const Intervenant = database.define("intervenant", {}, { timestamps: true });



export default Intervenant