import Request from 'request-promise'

export default {
    getUser: (token, id, callback) => {
        const qs = {
            access_token: token
        }
        Request.get({
            url:`https://graph.facebook.com/${id}`,
            qs
        }).then(res => callback(null, res)).catch(err => callback(err))
    }
}