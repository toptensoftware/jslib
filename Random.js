import { binarySearch } from "./utils_misc.js";

export class Random
{
    static int(min, max)
    {
        if (max == undefined)
        {
            max = min;
            min = 0;
        }

        return min + Math.floor(Math.random() * (max - min));
    }

    static float(min, max)
    {
        if (max == undefined)
        {
            max = min;
            min = 0;
        }

        return min + Math.random() * (max - min);
    }

    static bool()
    {
        return Math.random() < 0.5;
    }

    static hex(bytes)
    {
        let str = '';
        for (let i=0; i<bytes; i++)
        {
            str += Random.int(256).toString(16).padStart(2, "0")
        }
        return str;
    }

    static weighted(weights)
    {
        let weight_positions = [];
        let totalWeight = 0;
        for (let w of weights)
        {
            totalWeight += w ?? 0;
            weight_positions.push(totalWeight);
        }
        return function()
        {
            let pick = Math.random() * totalWeight;
            let index = binarySearch(weight_positions, (x) => x - pick);
            if (index < 0)
                index = -index - 1;
            return index;
        }
    }
}

