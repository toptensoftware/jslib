
export class Concurrency
{
    // Runs tasks in parallel with a max concurrency.
    //  - `tasks` param should be an iterable collection of promises
    //  - `concurrency` is the maximum number of tasks to run at once
    //  - returns an array of results in same order as returned from
    //    the tasks.  Each result is an object with either `value` key
    //    if the promise returned a value, or `error` if the task threw
    //    an error.
    static async run(tasks, concurrency)
    {
        return new Promise((resolve) => {

            let inFlight = 0;
            let results = [];

            // Queue the first N tasks
            for (let i=0; i<concurrency; i++)
            {
                queueNext();
            }
        
            function queueNext()
            {
                // Get the next task
                let task = tasks.next();
                if (task.done)
                {
                    // No more tasks, when none in flight resolve the promise
                    if (inFlight == 0)
                        resolve(results);
                    return;
                }
        
                // Remember we have an in-flight promise running
                inFlight++;

                // Create result entry for this task
                let result = {};
                results.push(result);
        
                // Wait for it to finish
                task.value
                    .then(function(value) {
                        if (value !== undefined)
                            result.value = value;
                    })
                    .catch(function(error) {
                        result.error = error;
                    })
                    .finally(function() {
                        inFlight--;
                        queueNext();
                    });
            }
        });
    }

    // Process an array of data in parallel, by passing to an async
    // callback(data[i]), with max concurrency
    static async process(data, callback, concurrency)
    {
        return Concurrency.run(function*() {
            for (let d of data)
            {
                yield callback(d);
            }
        }(), concurrency)
    }
}

