export class VelocityCalculator
{
    constructor()
    {
        this.points = [];
    }

    update(pos)
    {
        let now = Date.now();

        // Trim old points
        while (this.points.length > 0 && now - this.points[0].time > 500)
            this.points.shift();

        if (this.points.length && this.points[this.points.length - 1].time == now)
            this.points.pop();

        // Store new point
        this.points.push({
            pos,
            time: now,
        });
    }

    get value()
    {
        if (this.points.length < 2)
            return 0;

        let total = 0;
        for (let i=0; i<this.points.length - 1; i++)
        {
            let a = this.points[i];
            let b = this.points[i+1];

            total +=  (b.pos - a.pos) * 1000 / (b.time - a.time);;
        }

        return total / (this.points.length - 1);
    }

}