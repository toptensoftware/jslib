export class SelectionSet
{
    constructor()
    {
        this.set = new Set();
        this.inverse = false;
    }

    get specifier()
    {
        let spec = this.inverse ? "!" : "";
        let items = Array.from(this.set);
        items.sort((a,b) => a-b);
        for (let i=0; i<items.length; i++)
        {
            if (i > 0)
                spec += ',';

            spec += items[i].toString();

            let j = i
            while (j + 1 < items.length && items[j+1] == items[j] + 1)
            {
                j++;
            }

            if (j > i)
            {
                spec += '-';
                spec += items[j]
            }
            
            i=j;
        }
        return spec;
    }

    count(fullsetSize)
    {
        if (this.inverse)
            return fullsetSize - this.set.size;
        else
            return this.set.size;
    }

    get size()
    {
        return this.set.size;
    }

    has(item)
    {
        return this.set.has(item) ^ this.inverse;
    }

    toggle(item)
    {
        if (this.has(item))
        {
            this.delete(item);
            return false;
        }
        else
        {
            this.add(item);
            return true;
        }
    }

    add(item)
    {
        if (this.inverse)
            this.set.delete(item);
        else
            this.set.add(item);
    }

    delete(item)
    {
        if (this.inverse)
            this.set.add(item);
        else
            this.set.delete(item);
    }

    setHas(item, included)
    {
        if (included)
            this.add(item);
        else
            this.delete(item);   
    }

    addAll()
    {
        this.set = new Set();
        this.inverse = true;
    }

    clearAll()
    {
        this.set = new Set();
        this.inverse = false;
    }

    invert()
    {
        this.inverse = !this.inverse;
    }
}
