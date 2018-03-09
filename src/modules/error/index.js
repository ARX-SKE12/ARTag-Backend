
export const errors = {
    UNAUTHORIZED: 'Unauthorized',
    TOKEN_LOST: 'Token Lost',
    INTERNAL_ERROR: 'Internal Error'
}

export function throwError (socket, event, error) {
    socket.emit(event, { error })
} 
