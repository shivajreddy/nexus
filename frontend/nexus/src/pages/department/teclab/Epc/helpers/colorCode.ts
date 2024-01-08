//! Color Coding the dates Feature ----- START
import {CellClassParams, CellClassRules, CellStyleFunc} from "ag-grid-community";

const today = new Date();
const prevWeekDate = new Date();
prevWeekDate.setDate(new Date().getDate() - 7);

// styles represent the urgency. 1 being less urgent, 3 being most urgent
const style_1 = { color: "black", backgroundColor: "#a2d2ff" }; //bg blue. dist >= 11
const style_2 = { color: "black", backgroundColor: "#99d98c" }; //bg green. 6<=dist<=10 purple
const style_3 = { color: "black", backgroundColor: "#ffb703" }; //bg yellow. 3<=dist<=5 green
const style_4 = { color: "white", backgroundColor: "#e85d04" }; //bg Orange. 1<=dist<=2 yellow
const style_5 = { color: "white", backgroundColor: "#dc2f02" }; //bg dark-orange. dist==0 orange
const style_6 = { color: "black", backgroundColor: "#e78284" }; //bg red. dist < 0 red
const style_none = { color: "black" }; // No Style

// based on the given date_str return the style_n object
function color_code(date_str) {
    let curr_date = create_date(date_str);
    let today = new Date();
    let diff_in_minutes = curr_date.getTime() - today.getTime();
    let mins = 1000 * 3600 * 24;
    let diff_in_days = diff_in_minutes / mins;

    if (diff_in_days >= 11) {
        return style_1;
    }
    if (6 <= diff_in_days) {
        return style_2;
    }
    if (3 <= diff_in_days) {
        return style_3;
    }
    if (1 <= diff_in_days) {
        return style_4;
    }
    if (0 <= diff_in_days) {
        return style_5;
    }
    if (diff_in_days < 0) {
        return style_6;
    }
    return style_none;
}

//? Calculate next N'th work date from given Date
// Helper function to create actual date object from string
function create_date(str_date: string) {
    const split_date = str_date.split("-");
    const year = parseInt(split_date[0]);
    // for some weird reason month is being set to given+1, so setting it as -1
    const month = parseInt(split_date[1]) - 1;
    const date = parseInt(split_date[2]);
    let today = new Date();
    today.setFullYear(year, month, date);
    // today.setYear(year);
    // today.setMonth(month);
    // today.setDate(date);
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


const myRules: CellClassRules = {
    // 'bg-red-600 text-stone-50': (params) => color_code(params.value),
    // 'bg-gray-600 text-stone-50': (params) => color_code(params.value),
    'bg-red-600 text-stone-50': (params) => params.value === '03/10/2022',
    'bg-gray-600 text-stone-50': (params) => params.value === '06/15/2022',
};

function getColorScheme(assignedDateStr: string, finishedDateStr:string, duration: number){
    // If there is no assigned date yet, no need to color-code
    if (assignedDateStr === null) {
        return null;
    }

    // const assigned_date = create_date(assignedDateStr);
    const assigned_date = new Date(assignedDateStr);

    // if there is no finished date, compare to today
    let target_date = new Date();
    if (finishedDateStr !== null) {
        // target_date = create_date(finishedDateStr);
        target_date = new Date(finishedDateStr);
    }
    let diff_in_minutes = assigned_date.getTime() - target_date.getTime();

    let total_minutes = 1000 * 3600 * 24;
    let remaining_days = diff_in_minutes / total_minutes;

    const time_left_in_percent = (remaining_days * 100) / duration;
    console.log("::::", assigned_date, target_date, time_left_in_percent);

    if (time_left_in_percent >= 100) {
        return style_1;
    }
    if (time_left_in_percent >= 75) {
        return style_2;
    }
    if (time_left_in_percent >= 50) {
        return style_3;
    }
    if (time_left_in_percent >= 25) {
        return style_4;
    }
    if (time_left_in_percent >= 1) {
        return style_5;
    }
    return style_6;
}

function test_fn(params: CellClassParams) {
    // const target_id = find_compliment_id(params.column.getId());
    // console.log(params.column.getId(), params.data[target_id], params.value);
    if (params.column.getId() === 'drafting_finished_date') {
        return getColorScheme(params.data['drafting_assigned_on_date'], params.value, 14);
    }
    if (params.column.getId() === 'engineering_received'){
        return getColorScheme(params.data['engineering_sent'],params.value, 20);
    }
    if (params.column.getId() === 'plat_received'){
        return getColorScheme(params.data['plat_sent'],params.value, 25);
    }
    if (params.column.getId() === 'permit_received'){
        return getColorScheme(params.data['permit_submitted'],params.value, 10);
    }
    if (params.column.getId() === 'bbp_posted') {
        return getColorScheme(params.data['permit_received'],params.value, 3);
    }
    // console.log(params.data['drafting_assigned_on_date'], "params.value :: ", params.value, " duration :: ", duration);
    if (params.value === '03/10/2022'){
        return {
            backgroundColor: 'red',
            color: 'white'
        }
    }
}

// export default color_code;
export default test_fn;