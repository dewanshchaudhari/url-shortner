const Joi = require('joi');
const schema = Joi.object({
    url: Joi.string()
        .uri()
        .required(),
    len: Joi.number()
        .min(2)
        .max(11),
    slug: Joi.string().alphanum(),
});
const headers = {
    'content-type': 'application/json;charset=UTF-8',
};
const sendResponse = async (body, code = 200) => {
    return new Response(JSON.stringify(body, null, 2), {
        headers,
        status: code,
    });
};
const randomString = async (len = 6) => {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let result = '';
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const value = await links.get(result);
    if (value === null) return result;
    else return await randomString();
};
const save_url = async (url, slug) => {
    let is_exist = await links.get(slug);
    if (is_exist !== null) return false;
    return await links.put(slug, url);
};
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
async function handleRequest(request) {
    if (request.method === 'POST') {
        const body = await request.json();
        const { error, value } = schema.validate(body);
        if (error) return sendResponse({ error: error.message }, 400);
        if (body.slug && body.len)
            return sendResponse({ error: 'request should contain either slug or length not both!' }, 400);
        if (value.slug) {
            let res = await save_url(value.url, value.slug);
            if (res === false) return sendResponse({ error: 'Slug in use!' }, 400);
            if (typeof res !== 'undefined') return sendResponse({ error: 'Error:Reach the KV write limitation.' }, 200);
            return sendResponse({ url: `${request.url}${value.slug}` }, 200);
        }
        let uniqueId = value.len ? await randomString(value.len) : await randomString();
        let res = await save_url(value.url, uniqueId);
        if (typeof res !== 'undefined') return sendResponse({ error: 'Error:Reach the KV write limitation.' }, 200);
        return sendResponse({ url: `${request.url}${uniqueId}` }, 200);
    } else if (request.method === 'GET') {
        const id = request.url.split('/')[3];
        const { error, value } = Joi.string()
            .alphanum()
            .validate(id);
        if (error) return sendResponse({ error: 'illegal url' }, 400);
        console.log(value);
        let url = await links.get(value);
        if (url === null) return sendResponse({ error: 'The url you visit is not found' }, 404);
        return Response.redirect(url, 302);
    }
}
