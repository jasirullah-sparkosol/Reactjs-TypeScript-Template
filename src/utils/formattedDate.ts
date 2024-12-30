export const formatDate = (dateString: string) => {
    // Create a new Date object from the dateString
    const date = new Date(dateString);

    // Extract the day, month, and year from the Date object
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    // Return the date in "dd-mm-yyyy" format
    return `${day}-${month}-${year}`;
};

export const formatDateTime = (dateString: string) => {
    // Create a new Date object from the dateString
    const date = new Date(dateString);

    // Define an array of month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Extract the day, month, and year from the Date object
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
    const month = monthNames[date.getMonth()]; // Get the month name from the array
    const year = date.getFullYear();

    // Extract the hours and minutes
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero if necessary

    // Determine if it's AM or PM
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12

    // Return the date in "dd-MMM-yyyy hh:mm am/pm" format
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};
