import {CellClassParams} from "ag-grid-community";

// styles to mark the cells whose task is not finished yet
const style_1 = {color: "black", backgroundColor: "#2d711e"};
const style_2 = {color: "black", backgroundColor: "#40a02b"};
const style_3 = {color: "black", backgroundColor: "#1e66f5"};
const style_4 = {color: "white", backgroundColor: "#df8e1d"};
const style_5 = {color: "black", backgroundColor: "#df5301"};
const style_6 = {color: "black", boxShadow: 'inset 0px 0px 20px 1px #d20f39'};

// Complimentary styles to mark the cells that have already finished the task
const style_1_comp = {color: "#2d711e", fontWeight: 600};
const style_2_comp = {color: "#40a02b", fontWeight: 600};
const style_3_comp = {color: "#1e66f5", fontWeight: 600};
const style_4_comp = {color: "#df8e1d", fontWeight: 600};
const style_5_comp = {color: "#df5301", fontWeight: 600};
const style_6_comp = {color: "#d20f39", fontWeight: 600}


/*
 fn(start-date, finished-date)
   if there is no start-date, no color-code

   there is no finished date
        calculate anticipated-date from start-date until duration given
        get the % of days is left

   there is a finished date
        what is the diff in working days from start to finish
        get the % of days it took to finish

 */
function getWorkingDaysDiff(startDate: string, endDate: string | Date) {
    // Copy the input dates to avoid modifying the original objects
    let currentDate = new Date(startDate);

    let targetDate;
    if (typeof endDate === 'string') {
        targetDate = new Date(endDate);
    } else {
        targetDate = endDate;
    }

    // Ensure that the start date is before the end date
    let direction = 1;
    if (currentDate > targetDate) {
        [currentDate, targetDate] = [targetDate, currentDate];
        direction = -1;
    }

    // Initialize the count of working days
    let workingDays = 0;

    // Loop through each day between the two dates
    while (currentDate < targetDate) {
        // Check if the current day is a weekday (Monday to Friday)
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            workingDays++;
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return workingDays * direction;
}

// color code the finish-date based on start-date and the length of the task
function getStyle(startDate: string, finishDate: string | null, taskDuration: number) {
    // if there is no start-date, no color coding for finish date
    if (startDate === null || startDate === undefined) {
        return null;
    }

    // there is a finish date, get the style for how many days it took to finish the task
    if (finishDate) {
        const days_taken_to_finish = getWorkingDaysDiff(startDate, finishDate);
        const days_taken_percent = (days_taken_to_finish * 100) / taskDuration;

        if (days_taken_percent <= 20) {
            return style_1_comp;
        }
        if (days_taken_percent <= 40) {
            return style_2_comp;
        }
        if (days_taken_percent <= 60) {
            return style_3_comp;
        }
        if (days_taken_percent <= 80) {
            return style_4_comp;
        }
        if (days_taken_percent <= 100) {
            return style_5_comp;
        }
        return style_6_comp;
    }

    // there is NO finish-date, calculate the anticipated date
    // and from get the diff from today to anticipated date
    if (finishDate === null) {
        const today = new Date();
        const days_already_over = getWorkingDaysDiff(startDate, today);
        const days_left_to_finish = taskDuration - days_already_over;

        if (days_left_to_finish <= 0) {
            return style_6;
        }
        if (days_left_to_finish <= 20) {
            return style_5;
        }
        if (days_left_to_finish <= 40) {
            return style_4;
        }
        if (days_left_to_finish <= 60) {
            return style_3;
        }
        if (days_left_to_finish <= 80) {
            return style_2;
        }
        if (days_left_to_finish <= 100) {
            return style_1;
        }
    }

}


function colorCode(params: CellClassParams) {
    // const target_id = find_compliment_id(params.column.getId());
    // console.log(params.column.getId(), params.data[target_id], params.value);
    if (params.column.getId() === 'drafting_finished_date') {
        // return getColorScheme(params.data['drafting_assigned_on_date'], params.value, 5);
        return getStyle(params.data['drafting_assigned_on_date'], params.value, 5);
    }
    if (params.column.getId() === 'engineering_received') {
        // return getColorScheme(params.data['engineering_sent'], params.value, 10);
        return getStyle(params.data['engineering_sent'], params.value, 10);
    }
    if (params.column.getId() === 'plat_received') {
        // return getColorScheme(params.data['plat_sent'], params.value, 10);
        return getStyle(params.data['plat_sent'], params.value, 10);
    }
    if (params.column.getId() === 'permit_received') {
        // return getColorScheme(params.data['permit_submitted'], params.value, 15);
        return getStyle(params.data['permit_submitted'], params.value, 15);
    }
    if (params.column.getId() === 'bbp_posted') {
        // return getColorScheme(params.data['permit_received'], params.value, 5);
        return getStyle(params.data['permit_received'], params.value, 5);
    }
}

// function colorCode2(params: CellClassParams) {
//     // const target_id = find_compliment_id(params.column.getId());
//     if (params.column.getId() === 'drafting_finished_date') {
//         // return getColorScheme(params.data['drafting_assigned_on_date'], params.value, 5);
//         console.log(params.column.getId(), params.data['drafting_assigned_on_date'], params.value);
//         return getStyle(params.data['drafting_assigned_on_date'], params.value, 5);
//     }
//     if (params.column.getId() === 'engineering_received') {
//         // return getColorScheme(params.data['engineering_sent'], params.value, 10);
//         return getStyle(params.data['engineering_sent'], params.value, 10);
//     }
//     if (params.column.getId() === 'plat_received') {
//         // return getColorScheme(params.data['plat_sent'], params.value, 10);
//         return getStyle(params.data['plat_sent'], params.value, 10);
//     }
//     if (params.column.getId() === 'permit_received') {
//         // return getColorScheme(params.data['permit_submitted'], params.value, 15);
//         return getStyle(params.data['permit_submitted'], params.value, 15);
//     }
//     if (params.column.getId() === 'bbp_posted') {
//         // return getColorScheme(params.data['permit_received'], params.value, 5);
//         return getStyle(params.data['permit_received'], params.value, 5);
//     }
// }

export default colorCode;
// export {colorCode, colorCode2};