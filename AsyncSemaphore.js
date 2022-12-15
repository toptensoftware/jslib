
// AsyncSemaphore provides a concurrency limit on
// a set of async operations.
export class AsyncSemaphore
{
    constructor(concurrency)
    {
        this.concurrency = concurrency;
        this.inFlight = 0;
        this.pending = [];
    }

    enter(callback)
    {
        return new Promise((resolve, reject) => {
            
            let self = this;

            this.pending.push({ callback, resolve, reject });
            invokeNext();

            function invokeNext()
            {
                if (self.inFlight < self.concurrency)
                {
                    let next = self.pending.shift();
                    if (next)
                    {
                        self.inFlight++;
                        next.callback()
                            .then(next.resolve)
                            .catch(next.reject)
                            .finally(() => {
                                self.inFlight--;
                                invokeNext();
                            })
                    }
                }
            }
        });
    }
}
