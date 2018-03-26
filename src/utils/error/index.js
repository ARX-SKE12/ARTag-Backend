
export const errors = {
    UNAUTHORIZED: 'Unauthorized',
    TOKEN_LOST: 'Token Lost',
    INTERNAL_ERROR: 'Internal Error',
    PERMISSION_DENIED: 'Permission Denied'
}

export function throwError (socket, event, error) {
    socket.emit(event, JSON.stringify({ error }))
} 
