import { formatTimeRemaining } from './utils_date.js';

export class ProgressCalculator
{
    constructor(name)
    {
        this.name = name;
        this.totalItemsProcessed = 0;
        this.itemsRemaining = 0;
        this.totalElapsedTime = 0;
        this.first = true;
    }

    enterBatch(itemsRemaining)
    {
        this.timeStart = Date.now();
        this.itemsRemaining = itemsRemaining;

        if (this.first)
        {
            this.first = false;
            console.log(`# progress: "${this.name}" 0% 0/${this.itemsRemaining}`)
        }
    }

    leaveBatch(itemsProcessed)
    {
        // Work out elapsed time
        this.totalElapsedTime += Date.now() - this.timeStart;
        delete this.timeStart;

        // Update counts
        this.totalItemsProcessed += itemsProcessed;
        this.itemsRemaining -= itemsProcessed;

        let p = this.progress;
        console.log(`# progress: "${this.name}" ${Math.floor(p.complete * 100)}% ${p.processedItems}/${p.totalItems} ${formatTimeRemaining(p.timeRemaining)}`)
    }


    get progress()
    {
        let r = {};
        
        r.totalItems = this.totalItemsProcessed + this.itemsRemaining;
        r.processedItems = this.totalItemsProcessed;
        r.complete = r.totalItems ? (this.totalItemsProcessed / r.totalItems) : 0;
        r.elapsedTime = this.totalElapsedTime;

        if (this.totalItemsProcessed)
        {
            r.timePerItem = this.totalElapsedTime / this.totalItemsProcessed;
            r.timeRemaining = this.itemsRemaining * r.timePerItem;
        }

        return r;
    }
}
