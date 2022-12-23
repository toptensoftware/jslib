import crypto from 'crypto';
import { delay } from './Utils.js';

export class AsyncInstanceMap
{
    constructor()
    {
        this.map = new Map();
    }

    static formatKey(key)
    {
        return crypto.createHash('sha256').update(JSON.stringify(key)).digest('hex');
    }

    get(key, factory)
    {
        // Make key
        let saveKey = key;
        key = AsyncInstanceMap.formatKey(key);

        // Already exists?
        let e = this.map.get(key);
        if (e)
            return e.promise;

        // Create entry and call factory
        e = {
            promise: factory(saveKey)
        };

        // Store in map
        this.map.set(key, e);
        return e.promise;
    }

    delete(key)
    {
        this.map.delete(AsyncInstanceMap.formatKey(key));
    }
}