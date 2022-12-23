export const monthNames = [
    'January', 'Febrary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export const dayNamesShort = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
];


export function getMonthName(month)
{
    return monthNames[month-1];
}

export function getDayName(day)
{
    return dayNames[day];
}

let std_formats = ['full', 'long', 'medium', 'short'];
function is_std_format(style)
{
    return std_formats.indexOf(style) >= 0;
}

export function formatLocalDate(d, format)
{
    let now = new Date();
    d = new Date(d + (now.getTimezoneOffset() * 60000));
    if (!format)
        format = "medium"
    if (is_std_format(format))
        return d.toLocaleDateString(undefined, { dateStyle: format });
    else
        return format_date(format, d);
}

export function formatDate(d, format)
{
    d = new Date(d);
    if (!format)
        format = "medium"
    if (is_std_format(format))
        return d.toLocaleDateString(undefined, { dateStyle: format });
    else
        return format_date(format, d);
}

export function formatLocalTime(d, format)
{
    let now = new Date();
    d = new Date(d + (now.getTimezoneOffset() * 60000));
    if (!format)
        format = "short"
    if (is_std_format(format))
        return d.toLocaleTimeString(undefined, { timeStyle: format });
    else
        return format_date(format, d);
}

export function formatTime(d, format)
{
    d = new Date(d);
    if (!format)
        format = "short"
    if (is_std_format(format))
        return d.toLocaleTimeString(undefined, { timeStyle: format });
    else
        return format_date(format, d);
}

// Format a date similar to PHP's date formatting
// Based on this: https://gist.github.com/williamd5/56904a0a505fd8e18c646398e94135a6
//   '\j' - 1 to 31
//   '\d' - 01 to 31
//   '\l' - Sunday
//   '\w' - 0 to 7 (0=Sunday,1=Monday,...6=Saturday)
//   '\D' - Sun
//   '\m' - 01 to 12 (month)
//   '\n' - 1 to 12 (month)
//   '\F' - January
//   '\M' - Jan
//   '\Y' - 2022
//   '\y' - 22
//   '\h' - 01 to 12 (hours)
//   '\H' - 00 to 23 (hours)
//   '\g' - 1 to 12 (hours)
//   '\G' - 0 to 23 (hours)
//   '\a' - am
//   '\A' - AM
//   '\i' - 00 to 59 (minutes)
//   '\s' - 00 to 59 (seconds)
//   '\c' - ISO 8601 date "2012-11-20T18:05:54.944Z"
function format_date(format, date)
{
    // Check have date
    if (!date)
        return null;
    
    let string = '';
    let mo = date.getMonth(); // month (0-11)
    let m1 = mo + 1; // month (1-12)
    let dow = date.getDay(); // day of week (0-6)
    let d = date.getDate(); // day of the month (1-31)
    let y = date.getFullYear(); // 1999 or 2003
    let h = date.getHours(); // hour (0-23)
    let mi = date.getMinutes(); // minute (0-59)
    let s = date.getSeconds(); // seconds (0-59)

    for (let i of format.match(/(\\)*./g))
    {
        switch (i)
        {
            case 'j': 
                string += d;
                break;

            case 'd': 
                string += (d < 10) ? "0" + d : d;
                break;

            case 'l': 
                string += dayNames[dow];
                break;

            case 'w':
                string += dow;
                break;

            case 'D':
                string += dayNamesShort[dow];
                break;

            case 'm':
                string += (m1 < 10) ? "0" + m1 : m1;
                break;

            case 'n':
                string += m1;
                break;

            case 'F':
                string += monthNames[mo];
                break;

            case 'M':
                string += monthNamesShort[mo];
                break;

            case 'Y':
                string += y;
                break;

            case 'y':
                string += y.toString().slice(-2);
                break;

            case 'h':
                var hour = (h === 0) ? 12 : h;
                hour = (hour > 12) ? hour - 12 : hour;
                string += (hour < 10) ? "0" + hour : hour;
                break;

            case 'H':
                string += (h < 10) ? "0" + h : h;
                break;

            case 'g':
                var hour = (h === 0) ? 12 : h;
                string += (hour > 12) ? hour - 12 : hour;
                break;

            case 'G':
                string += h;
                break;

            case 'a':
                string += (h < 12) ? "am" : "pm";
                break;

            case 'A':
                string += (h < 12) ? "AM" : "PM";
                break;

            case 'i':
                string += (mi < 10) ? "0" + mi : mi;
                break;

            case 's':
                string += (s < 10) ? "0" + s : s;
                break;

            case 'c':
                string += date.toISOString();
                break;

            default:
                if (i.startsWith("\\")) 
                    i = i.substr(1);
                string += i;
        }
    }

    return string;
}


export function formatTimeRemaining(ms)
{
    let secs = Math.round(ms / 1000);
    if (secs < 60)
    {
        return `${secs} second${secs == 1 ? '' : 's'}`;
    }
    
    let mins = Math.round(secs / 60);
    if (mins < 60)
    {
        return `${mins} minute${mins == 1 ? '' : 's'}`;
    }

    if (mins < 60 * 8 && Math.floor(mins % 60) != 0)
    {
        return `${Math.floor(mins / 60)} hours, ${Math.floor(mins % 60)} minutes`;
    }

    return `${Math.floor(mins / 60)} hours`;
}
