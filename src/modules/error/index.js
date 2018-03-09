
export const errors = {
    UNAUTHORIZED: 'Unauthorized',
    TOKEN_LOST: 'Token Lost',
    INTERNAL_ERROR: 'Internal Error'
}

export function throwError (error) {
    return { error }
} 
