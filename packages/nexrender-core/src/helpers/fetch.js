const { fetchBuilder, FileSystemCache, } = require('node-fetch-cache')
const options = {
}
const fetch = fetchBuilder.withCache(new FileSystemCache(options));
module.exports = async (resource, options = {}) => {
    const { timeout = 8000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    if (!response.ok) {
        await response.ejectFromCache();
        Promise.reject({ reason: 'Initial error downloading file', meta: { src: resource, error: res.error } })
    }
    return response;
}