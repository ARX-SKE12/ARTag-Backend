import Request from 'request-promise'

export function getMe(token, callback) {
    const qs = {
        access_token: token
    }
    Request.get({
        url:'https://graph.facebook.com/me',
        qs
    }).then(res => callback(null, res)).catch(err => callback(err))
}

export default {
    getUser: (token, id, callback) => {
        const qs = {
            access_token: token
        }
        Request.get({
            url:`https://graph.facebook.com/${id}`,
            qs
        }).then(res => callback(null, res)).catch(err => callback(err))
    },
    getMe: (token, callback) => {
        const qs = {
            access_token: token
        }
        Request.get({
            url:`https://graph.facebook.com/${id}`,
            qs
        }).then(res => callback(null, res)).catch(err => callback(err))
    }
}