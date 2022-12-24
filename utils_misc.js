// From here: https://stackoverflow.com/a/61395050/77002
export function merge(target, ...sources) 
{
    for (let source of sources) 
    {
      for (let k in source) 
      {
        let vs = source[k], vt = target[k]
        if (Object(vs) == vs && Object(vt) === vt) 
        {
          target[k] = merge(vt, vs);
          continue;
        }

        target[k] = source[k];
      }
    }
    return target
}

// Filter an object creating a new object with keys removed
// The callback predicate takes (key, value) of the object being filtered.
// Return true to keep the key, false to remove it
export function filterObject(obj, predicate)
{
    let newObj = {};
    for (let k of Object.keys(obj))
    {
        if (predicate(k, obj[k]))
            newObj[k] = obj[k];
    }
    return newObj;
}

export function properCase(stri)
{
    return str.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
}

export function trimSlashes(str)
{
    while (str.startsWith('/'))
        str = str.substring(1);
    while (str.endsWith('/'))
        str = str.substring(0, str.length-1);
    return str;
}

export function htmlEncode(str)
{
    return str.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
}

export function connectEvents(el, options)
{
    for (let e in options)
    {
        if (typeof options[e] == 'function')
            el.addEventListener(e, options[e]);
        else if (options[e].el)
            options[e].el.addEventListener(e, options[e].handler ?? options[e][e], options[e].options);
    }

    return function()
    {
        if (options)
        {
            for (let e in options)
            {
                if (typeof options[e] == 'function')
                    el.removeEventListener(e, options[e]);
                else if (options[e].el)
                    options[e].el.removeEventListener(e, options[e].handler ?? options[e][e], options[e].options);
            }
        }
        options = null;
    }
}



export function groupBy(array, groupFn)
{
    let map = new Map();
    for (let i=0; i<array.length; i++)
    {
        let k = groupFn(array[i]);
        let group = map.get(k);
        if (!group)
        {
            group = [];
            map.set(k, group);
        }
        group.push(array[i]);
    }

    return [...map.keys()].map(x => ({
        group: x,
        items: map.get(x),
    }))
}

export function orderBy(array, compareFn)
{
    let array2 = [...array];
    array2.sort(compareFn);
    return array2;
}

export function any(array, predicate)
{
    for (let i of array)
    {
        if (predicate(i))
            return true;
    }
    return false;
}

export function all(array, predicate)
{
    for (let i of array)
    {
        if (!predicate(i))
            return false;
    }
    return true;
}

export function compareStrings(a, b)
{
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
}

export function queryString(args)
{
    if (!args)
        return "";
    let qs = Object.keys(args).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(args[key])}`).join('&');    
    if (qs)
        return "?" + qs;
    else
        return "";
}

export function formatDimensions(width, height)
{
    if (width && height)
        return `${width} x ${height}`;
    else
        return "-";
}

// Helper for format byte size string
const units = ["B", "KB", "MB", "GB", "TB", 'PB', 'EB', 'ZB', 'YB']
export function formatBytes(bytes) {
  
    if (bytes == 0) 
        return "0B"
  
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

    if (i == 0)
        return bytes + units[i]

    const n = bytes / Math.pow(1024, i)
    return n.toFixed(n < 10 ? 1 : 0) + units[i];
}


// https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
export function luminance(R8bit,G8bit,B8bit)
{
    let RsRGB = R8bit/255;
    let GsRGB = G8bit/255;
    let BsRGB = B8bit/255;
    let R = RsRGB <= 0.03928 ? RsRGB/12.92 : ((RsRGB+0.055)/1.055) ** 2.4;
    let G = GsRGB <= 0.03928 ? GsRGB/12.92 : ((GsRGB+0.055)/1.055) ** 2.4;
    let B = BsRGB <= 0.03928 ? BsRGB/12.92 : ((BsRGB+0.055)/1.055) ** 2.4;
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Parse a string in css rgb(r,g,b) format
export function parseRgbString(str)
{
    let m = str.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (m)
        return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
    return;
}

// Parse a color in any valid css format
export function parseColor(color)
{
    let div = document.createElement('div');
    div.style.color = color;
    div.style.display = "none";
    document.body.appendChild(div);
    let result = parseRgbString(getComputedStyle(div).color);
    div.parentNode.removeChild(div);
    return result;
}

export function ensureVisible(elItem, elContainer, options)
{
    if (!elItem)
        return;

    options.margin = options.margin || 0;

    // Ensure visible
    options.rectElem = elItem.getBoundingClientRect();
    options.rectContainer = elContainer.getBoundingClientRect();

    if (options.rectElem.bottom > options.rectContainer.bottom - options.margin) 
        elItem.scrollIntoView({ behavior: "auto", block: "end" });
    if (options.rectElem.top < options.rectContainer.top + options.margin) 
        elItem.scrollIntoView({ behavior: "auto", block: "start" });        

}

export async function delay(period)
{
    return new Promise((resolve) => setTimeout(resolve, period));
}

export function binarySearch(array, compare)
{
    let lo = 0;
    let hi = array.length - 1;

    while (lo <= hi)
    {
        let mid = Math.floor((lo + hi) / 2);
        let comp = compare(array[mid]);
        if (comp == 0)
            return mid;
        if (comp < 0)
            lo = mid + 1;
        else
            hi = mid - 1;
    }

    return -lo - 1;
}