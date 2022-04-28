/*
filename: circ_date_color.js
purpose: convert US date to RGB
description: Normalize date values (month, day, year) to period length, then remap to 24-bit RGB color value ranges

todo: create a calendar or timeline and evaluate aesthetically

*/

// define constants
const years_in_century = 100
const months_in_year = 12
const days_in_month = 30
const rgb_range = 255

// define test dates
const test_dates = [
    {
        'month': 1
        , 'day': 1
        , 'year': 2000
    }
    ,
    {
        'month': 12
        , 'day': 31
        , 'year': 1999
    }
    ,
    {
        'month': 12
        , 'day': 25
        , 'year': 0
    }
    ,
    {
        'month': 7
        , 'day': 4
        , 'year': 1776
    }
    ,
    {
        'month': 12
        , 'day': 7
        , 'year': 1941
    }
    ,
    {
        'month': 9
        , 'day': 11
        , 'year': 2001
    }
]

// map test dates to colors
test_dates.map(
    // get an RGB value for a date
    (test_date) => {
        // RGB base object
        const rgb_color = {'r': 0, 'g': 0, 'b': 0}

        // normalize date and map to 24-bit color
        rgb_color.r = Math.floor(rgb_range * test_date.month / months_in_year)
        rgb_color.g = Math.floor(rgb_range * test_date.day / days_in_month)
        rgb_color.b = Math.floor(rgb_range * (test_date.year % years_in_century) / years_in_century)

        // output
        console.log(`${test_date.month}/${test_date.day}/${test_date.year}`);
        console.table(rgb_color);

        return rgb_color;
    }
);