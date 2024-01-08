//! Color Coding the dates Feature ----- START
const today = new Date();
const prevWeekDate = new Date();
prevWeekDate.setDate(new Date().getDate() - 7);

// styles represent the urgency. 1 being less urgent, 3 being most urgent
const style_1 = { color: "black", backgroundColor: "#a2d2ff" }; //bg blue. dist >= 11
const style_2 = { color: "black", backgroundColor: "#99d98c" }; //bg green. 6<=dist<=10 purple
const style_3 = { color: "black", backgroundColor: "#ffb703" }; //bg yellow. 3<=dist<=5 green
const style_4 = { color: "white", backgroundColor: "#e85d04" }; //bg Orange. 1<=dist<=2 yellow
const style_5 = { color: "white", backgroundColor: "#dc2f02" }; //bg dark-orange. dist==0 orange
const style_6 = { color: "white", backgroundColor: "#d00000" }; //bg red. dist < 0 red
const style_none = { color: "black" }; // No Style

// based on the given date_str return the style_n object
function color_code(date_str) {
    let curr_date = create_date(date_str);
    let today = new Date();
    let diff = curr_date.getTime() - today.getTime();
    let mins = 1000 * 3600 * 24;
    let diff_days = diff / mins;

    if (diff_days >= 11) {
        return style_1;
    }
    if (6 <= diff_days) {
        return style_2;
    }
    if (3 <= diff_days) {
        return style_3;
    }
    if (1 <= diff_days) {
        return style_4;
    }
    if (0 <= diff_days) {
        return style_5;
    }
    if (diff_days < 0) {
        return style_6;
    }
    return style_none;
}

//? Calculate next N'th work date from given Date
// Helper function to create actual date object from string
function create_date(str_date) {
    const splitted = str_date.split("-");
    const year = parseInt(splitted[0]);
    // for some weird reason month is being set to given+1, so setting it as -1
    const month = parseInt(splitted[1] - 1);
    const date = parseInt(splitted[2]);
    let today = new Date();
    today.setYear(year);
    today.setMonth(month);
    today.setDate(date);
    return today;
}

// starting from the next day of given day, return the nth working day
function calc_work_date(from_date_str, no_of_days) {
    let to_date = create_date(from_date_str);
    while (no_of_days > 0) {
        to_date.setDate(to_date.getDate() + 1);

        if (to_date.getDay() != 0 && to_date.getDay() != 6) {
            no_of_days--;
        }
    }
    return to_date;
}
//! Color Coding the dates Feature ------ END

export default color_code;