export const formatDateToCompare =(date) =>{
    const databaseDate = new Date(date);
    return databaseDate

}

export const formattedDate =(date) =>{
// Extract day, month, and year
const convertedDate = formatDateToCompare(date)

const day = convertedDate.getDate();
const month = convertedDate.getMonth() + 1; // Note that getMonth() returns values from 0 to 11.
const year = convertedDate.getFullYear();

// Create the formatted date string
const frmD = `${day}/${month}/${year}`;

return frmD
}