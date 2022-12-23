export class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    static distance(a, b)
    {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

export class Rectangle
{
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get left() { return this.x; }
    get top() { return this.y; }
    get right() { return this.x + this.width; }
    get bottom() { return this.y + this.height; }
    get area() { return this.width * this.height; }
    get aspect() { return this.width / this.height; }
    get topLeft() { return new Point(this.x, this.y); }
    get topRight() { return new Point(this.right, this.y);}
    get bottomRight() { return new Point(this.bottom, this.right); }
    get bottomLeft() { return new Point(this.x, this.bottom); }
    get center() { return new Point(this.x + this.width / 2, this.y + this.height / 2); }
    get isNull() { return this.width == 0 || this.heigth == 0; }

    clone()
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    containsPoint(pt)
    {
        return pt.x >= this.x && pt.x <= this.right &&
                pt.y >= this.y && pt.y <= this.bottom;
    }

    containsRect(other)
    {
        return other.x >= this.x && 
            other.right <= this.right && 
            other.y >= this.y && 
            other.bottom <= this.bottom;
    }

    intersection(other)
    {
        let x = Math.max(this.x, other.x);
        let width = Math.min(this.right, other.right) - x;
        let y = Math.max(this.y, other.y);
        let height = Math.min(this.bottom, other.bottom) - y;
        if (width <= 0 || height <= 0)
            return null;
        return new Rectangle(x, y, width, height);
    }

    union(other)
    {
        let x = Math.min(this.x, other.x);
        let right = Math.max(this.right, other.right);
        let y = Math.min(this.y, other.y);
        let bottom = Math.max(this.bottom, other.bottom);
        return new Rectangle(x, y, right - x, bottom - y);
    }

    inflate(dx, dy)
    {
        return new Rectangle(
            this.x - dx,
            this.y - dy,
            this.width + dx + dx,
            this.height + dy + dy,
        );
    }


    // Calculate a rectangle centered inside rect, with the specified
    // aspect ratio (width/height)
    contain(aspect)
    {
        let rectAspect = this.aspect;
        if (rectAspect > aspect)
        {
            return new Rectangle(
                (this.width - this.height * aspect) / 2,
                0,
                this.height * aspect,
                this.height,
            );
        }
        else
        {
            return new Rectangle(
                0, 
                (this.height - this.width / aspect) / 2,
                this.width,
                this.width / aspect,
            )
        }      
    }


    // Calculate a rectangle centered covering rect, with the specified
    // aspect ratio (width/height)
    cover(aspect)
    {
        let rectAspect = this.aspect;
        if (rectAspect > aspect)
        {
            return new Rectangle(
                0,
                - ((this.width / aspect) - this.height)/2,
                this.width,
                this.width / aspect,
            );
        }
        else
        {
            return new Rectangle(
                - ((this.height * aspect) - this.width)/2,
                0,
                this.height * aspect,
                this.height,
            );
        }      
    }

    // Scale a rectangle, keeping the same center point
    scale(scale)
    {
        return new Rectangle(
            this.x + (this.width - this.width * scale) / 2,
            this.y + (this.height - this.height * scale) / 2,
            this.width * scale,
            this.height * scale,
        );
    }

    offset(dx, dy)
    {
        return new Rectangle(this.x + dx, this.y + dy, this.width, this.height);
    }
 
    // Shift a rectangle to that it's inside limiting rectangle
    // If it can't fit, then shift as little as possible to make it fit
    limit(limits)
    {
        return this.offset(limit_h(), limit_v());

        // Horizontal limiting
        function limit_h()
        {
            // Work out how much to shift by to align each side
            let a = limits.x - this.x;
            let b = (limits.x + limits.width) - (this.x + this.width);
        
            // If both, pick the smaller shift
            if (a > 0 && b < 0)
            {
                if (a > -b)
                    return b;
            }
            else if (b < 0)
            {
                return b;
            }
            else if (a < 0)
                return 0;
        
            return a;
        }
        
        // Vertical limiting
        function limit_v()
        {
            // Work out how much to shift by to align each side
            let a = limits.y - this.y;
            let b = (limits.y + limits.height) - (this.y + this.height);
        
            // If both, pick the smaller shift
            if (a > 0 && b < 0)
            {
                if (a > -b)
                    return b;
            }
            else if (b < 0)
            {
                return b
            }
            else if (a < 0)
                return 0;
        
            return a;
        }
    }

    static fromObject(o)
    {
        return new Rectangle(o.x ?? o.left, o.y ?? o.top, o.width, o.height);
    }

    static withCoords(left, top, right, bottom)
    {
        return new Rectangle(left, top, right - left, bottom - top);
    }

    static withCenter(x, y, width, height)
    {
        return new Rectangle(x - width/2, y - height/2, width, height);
    }

    static withAspectContaining(contain, aspect)
    {
        let containAspect = contain.width / contain.height;
        if (containAspect > aspect)
        {
            // Content is wider
            let height = contain.width / aspect;
            return new Rectangle(
                contain.x, 
                contain.y - (height - contain.height) / 2,
                contain.width,
                height
            );
        }
        else
        {
            // Content is narrower
            let width = contain.height * aspect;
            return new Rectangle(
                contain.x - (width - contain.width) / 2,
                contain.y,
                width,
                contain.height,
            );
        }
    }

    static containingPoints(pts)
    {
        let x = pts[0].x;
        let y = pts[0].y
        let right = pts[0].x;
        let bottom = pts[0].y;
        for (let p of pts)
        {
            if (p.x < x)
                x = p.x;
            if (p.x > right)
                right = p.x
            if (p.y < y)
                y = p.y;
            if (p.y > bottom)
                bottom = p.y;
        }
        return new Rectangle(x, y, right - x, bottom - y);
    }
}

export class Region
{
    constructor()
    {
        this.rects = [];
    }

    add(rect)
    {
        // Null rectangle?
        if (rect.width == 0 || rect.weight == 0)
            return;

        // Check if rect is already covered by other rectangle
        for (let i = 0; i < this.rects.length; i++)
        {
            if (does_rect_contain(this.rects[i], rect))
                return;
        }

        // Remove the new region from existing region
        this.subtract(rect);

        // Now add it back it
        this.rects.push({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        })
    }

    subtract(rect)
    {
        for (let i=this.rects.length - 1; i>=0; i--)
        {
            if (this._subtract(this.rects[i], rect))
            {
                this.rects.splice(i, 1);
            }
        }
    }

    // Get total area of the region
    get area()
    {
        let a = 0;
        for (let r of this.rects)
        {
            a += r.width * r.height;
        }
        return a;
    }

    // Internal helper to help with subtracting rectangles from the region
    _subtract(a, b)
    {
        // Do the two rectangles intersect?
        if (b.x >= a.x + a.width)
            return false;
        if (b.x + b.width <= a.x)
            return false;
        if (b.y >= a.y + a.height)
            return false;
        if (b.y + b.height <= a.y)
            return false;

        /*
            * Generate between 0 and 4 (inclusive) subrectangles of A
            *    +------------------------+
            *    |          A1            |
            *    +------+---------+-------+
            *    |  A2  |    B    |  A3   |
            *    +------+---------+-------+
            *    |          A4            |
            *    +------------------------+
            */

        // A1
        if (a.y < b.y)
        {
            this.rects.push(new Rectangle(a.x, a.y, a.width, b.y - a.y));
        }

        let a23Top = Math.max(a.y, b.y);
        let a23Height = Math.min(a.y + a.height, b.y + b.height) - a23Top;

        // A2
        if (a.x < b.x)
        {
            this.rects.push(new Rectangle(a.x, a23Top, b.x - a.x, a23Height));
        }

        // A3
        if (a.x + a.width > b.x + b.width)
        {
            this.rects.push(new Rectangle(b.x + b.width, a23Top, (a.x + a.width) - (b.x + b.width), a23Height));
        }

        // A4
        if (a.y + a.height > b.y + b.height)
        {
            this.rects.push(new Rectangle(a.x, b.y + b.height, a.width, (a.y + a.height) - (b.y + b.height)));
        }

        return true;
    }

}
