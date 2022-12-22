"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function organizeByDateAndTypeforNutrition(challengePosts, type, today, endDate) {
    console.log('type', type);
    let returnData = [];
    if (type === 'W') {
        returnData = getWeeklyStats(challengePosts, today, endDate);
    }
    else if (type === 'M') {
        returnData = getMonthlyStats(challengePosts, today, endDate);
    }
    else if (type === 'Y') {
        returnData = getYearlyStats(challengePosts, today, endDate);
    }
    else if (type === 'YD') {
        returnData = getYearToDateStats(challengePosts, today, endDate);
    }
    return returnData;
}
exports.default = organizeByDateAndTypeforNutrition;
function getWeeklyStats(challengePosts, today, endDate) {
    let tempDayString = endDate.toISOString().slice(0, 10);
    let returnData = [];
    for (let i = 0; i < 7; i++) {
        let tempDate = new Date(new Date(tempDayString).setDate(new Date(tempDayString).getDate() + i + 1));
        let index = challengePosts.findIndex((cp) => String(cp.assignDate) == String(tempDate));
        if (index > -1) {
            returnData.push(challengePosts[index]);
        }
        else {
            returnData.push({
                assignDate: tempDate,
                totalAmount: 0,
            });
        }
    }
    console.log('returnData', returnData);
    return returnData;
}
function getMonthlyStats(challengePosts, today, endDate) {
    let tempDayString = endDate.toISOString().slice(0, 10);
    let returnData = [];
    for (let i = 0; i < 30; i++) {
        let startDate = new Date(new Date(tempDayString).setDate(new Date(tempDayString).getDate() + i));
        let index = challengePosts.findIndex((cp) => cp.assignDate.toString() == startDate.toString());
        if (index !== -1) {
            returnData.push(challengePosts[index]);
        }
        else {
            returnData.push({
                assignDate: startDate,
                totalAmount: 0,
            });
        }
    }
    return returnData;
}
function getYearlyStats(challengePosts, today, endDate) {
    let returnData = [];
    for (let i = 0; i <= today.getMonth(); i++) {
        let firstDate = new Date();
        if (i + 1 < 10) {
            firstDate = new Date(new Date(`${today.getFullYear()}-0${i + 1}-01`)
                .toISOString()
                .slice(0, 10));
        }
        else {
            firstDate = new Date(new Date(`${today.getFullYear()}-${i + 1}-01`)
                .toISOString()
                .slice(0, 10));
        }
        let tempLastDay = getLastDate(today.getFullYear(), i);
        let lastDate = new Date();
        if (i + 1 < 10) {
            lastDate = new Date(new Date(`${today.getFullYear()}-0${i + 1}-${tempLastDay}`)
                .toISOString()
                .slice(0, 10));
        }
        else {
            lastDate = new Date(new Date(`${today.getFullYear()}-${i + 1}-${tempLastDay}`)
                .toISOString()
                .slice(0, 10));
        }
        let data = challengePosts.filter((cp) => cp.assignDate >= firstDate && cp.assignDate <= lastDate);
        let total = 0;
        if (data.length > 0) {
            data.forEach((d) => {
                total += d.totalAmount;
            });
            returnData.push({
                assignDate: firstDate,
                endDate: lastDate,
                totalAmount: total,
            });
        }
        else {
            returnData.push({
                assignDate: firstDate,
                endDate: lastDate,
                totalAmount: 0,
            });
        }
    }
    return returnData;
}
function getLastDate(y, m) {
    return new Date(y, m + 1, 0).getDate();
}
function getYearToDateStats(challengePosts, today, endDate) {
    let returnData = [];
    let firstDate = endDate;
    for (let i = 0; i < 12; i++) {
        let firstdayTempString = firstDate.toISOString().slice(0, 10);
        firstDate = new Date(new Date(firstdayTempString).setDate(new Date(firstdayTempString).getDate() + 1));
        let lastDate;
        if (i === 11) {
            lastDate = today;
        }
        else {
            lastDate = new Date(new Date(firstdayTempString).setDate(new Date(firstdayTempString).getDate() + 30));
        }
        let data = challengePosts.filter((cp) => cp.assignDate >= firstDate && cp.assignDate <= lastDate);
        let total = 0;
        if (data.length > 0) {
            data.forEach((d) => {
                total += d.totalAmount;
            });
            returnData.push({
                assignDate: firstDate,
                endDate: lastDate,
                totalAmount: total,
            });
        }
        else {
            returnData.push({
                assignDate: firstDate,
                endDate: lastDate,
                totalAmount: 0,
            });
        }
        firstDate = lastDate;
    }
    return returnData;
}
