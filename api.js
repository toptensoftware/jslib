// Wrapper for all API end point calls
import { queryString } from './Utils';

// Request cancel map
let cancelMap = new Map();

// Fetch helper
// If options.cancelKey is set, any previous requests with
// the same key will be delivered with null data.
export async function api_fetch(method, endPoint, data, options)
{
    // Setup base options
    let fetchOptions = {
        method: method,
        credentials: "include",
        cache: "no-cache",
        headers: {}
    }

    // Merge passed options (if any)
    options = options || {};
    if (options.fetchOptions)
    {
        Object.assign(fetchOptions, options?.fetchOptions);
    }

    // Setup cancel key instance
    let cancelInstance;
    if (options.cancelKey)
    {
        cancelInstance = {};
        cancelMap.set(options.cancelKey, cancelInstance);
    }

    try
    {
        // Add data
        if (data)
        {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(data);
        }

        // Make the request, throw if fails
        let response = await fetch(endPoint, fetchOptions);
        if (response.status < 200 || response.status > 299)
        {
            throw new Error("Server error:" + response.status);
        }

        // Get the response data
        let rdata = await response.json();

        // Check if this request was replaced by a subsequent request
        if (cancelInstance)
        {
            if (cancelMap.get(options.cancelKey) != cancelInstance)
                return null;
        }

        // Done
        return rdata;
    }
    finally
    {
        // Clean up cancel map
        if (cancelMap.get(options.cancelKey) == cancelInstance)
            cancelMap.delete(options.cancelKey);
    }
}

// Invokes a POST end point
export async function api_post(endPoint, data, options)
{
    return fetchJson("POST", endPoint, data, options);
}

// Invokes a GET end point
export async function api_get(endPoint, query, options)
{
    return fetchJson("GET", endPoint + queryString(query), null, options);
}

// Check if a cancellable request is currently in flight
export function api_pending(cancelKey)
{
    return cancelMap.has(cancelKey);
}

// Cancel an inflight request
export function api_cancel(cancelKey)
{
    cancelMap.set(cancelKey, {});
}
