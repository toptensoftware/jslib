/////////////////////////////////////////////////////////////////////////////
// StringScanner

function isDigit(ch)
{
    return ch>='0' && ch<='9';
}


export class StringScanner
{
    constructor()
    {
        this.reset.apply(this, arguments);
    }

    reset(string, position, length)
    {
        this.buf = arguments.length > 0 ? arguments[0] : null;
        this.start = arguments.length > 1 ? arguments[1] : 0;
        this.end = arguments.length > 2 ? this.start + arguments[2] : (this.buf == null ? 0 : this.buf.length);
        this.m_position = this.start;
        this.charset_offsets = {};
    }

    get position() { return this.m_position - this.start; }
    get length() { return this.end - this.start; }
    get bof() { return this.m_position == this.start; }
    get eof() { return this.m_position >= this.end; }
    get eol()
    {
        if (this.m_position >= this.end)
            return true;
        var ch = this.buf.charAt(this.m_position);
        return ch == '\r' || ch == '\n' || ch == undefined || ch == '';
    }
    get current()
    {
        if (this.m_position >= this.end)
            return "\0";
        return this.buf.charAt(this.m_position);
    }
    get remainder() 
    {
        return this.buf.substr(this.m_position);
    }


    skipForward(count) 
    {
        this.m_position += count;
    }

    charAtOffset(offset) 
    {
        if (this.m_position + offset >= this.end)
            return "\0";
        return this.buf.charAt(this.m_position + offset);
    }

    trySkipChar(ch) 
    {
        if (this.buf.charAt(this.m_position) == ch) {
            this.m_position++;
            return true;
        }
        return false;
    }

    trySkipString(s) 
    {
        if (this.buf.substr(this.m_position, s.length) == s) {
            this.m_position += s.length;
            return true;
        }
        return false;
    }

    trySkipWhitespace () 
    {
        var save = this.m_position;
        while (true) {
            var ch = this.buf.charAt(this.m_position);
            if (ch != ' ' && ch != '\t' && ch != '\r' && ch != '\n')
                break;
            this.m_position++;
        }
        return this.m_position != save;
    }

    skipToEOL()
    {
        while (!this.eol)
            this.m_position++;
    }

    trySkipEOL()
    {
        let start = this.m_position;
        if (this.current == '\r')
            this.m_position++;
        if (this.current == '\n')
            this.m_position++;
        return start != this.m_position;
    }

    mark() 
    {
        this.mark = this.m_position;
    }

    extract() 
    {
        if (this.mark >= this.m_position)
            return "";
        else
            return this.buf.substr(this.mark, this.m_position - this.mark);
    }

    trySkipIdentifier() 
    {
        var ch = this.buf.charAt(this.m_position);
        var start = this.m_position;

        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == '_') {
            this.m_position++;
            while (true) {
                ch = this.buf.charAt(this.m_position);
                if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == '_' || (ch >= '0' && ch <= '9'))
                    this.m_position++;
                else
                    return this.buf.substr(start, this.m_position - start);
            }
        }

        return null;
    }


    skipString(str) 
    {

        if (!this.trySkipString(str))
            throw new Error("Expression error, expected '" + str + "' at offset " + this.m_position);

    }

    trySkipInteger() 
    {

        if (!isDigit(this.buf.charAt(this.m_position)))
            return null;

        var start = this.m_position;
        while (isDigit(this.buf.charAt(this.m_position)))
        {
            this.m_position++;
        }

        return parseInt(this.buf.substr(start, this.m_position - start));
    }

    trySkipStringLiteral() 
    {
        var start = this.m_position;

        if (this.buf.charAt(this.m_position) == '\"') 
        {
            this.m_position++;
            var parts = [];
            var seg = this.m_position;

            while (this.m_position < this.end) 
            {
                var ch = this.buf.charAt(this.m_position);
                if (ch=='\\')
                {
                    // Save everything before the backslash
                    parts.push(this.buf.substr(seg, this.m_position - seg));

                    this.m_position++;
                    ch = this.buf.charAt(this.m_position);
                    switch (ch)
                    {
                        case '\"':
                        case '\'':
                        case '\\':
                            parts.push(ch);
                            break;

                        case 'r': parts.push('\r'); break;
                        case 'n': parts.push('\n'); break;
                        case 't': parts.push('\t'); break;
                        case '0': parts.push('\0'); break;

                        default:
                            parts.push(ch);
                            break;
                    }
                    this.m_position++;
                    seg = this.m_position;
                }
                else if (ch=='\"')
                {
                    var str = parts.join("") + this.buf.substr(seg, this.m_position - seg);
                    this.m_position++;
                    return str;
                }
                else
                {
                    this.m_position++;
                }
            }
        }

        this.m_position = start;
        return null;

    }
}
