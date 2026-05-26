
export const ResponseCode = {
    CORRECT: 200,
    CLIENT_ERROR: 400,
    PERMISSION_ERROR: 401,
    ACCESS_ERROR: 403,
    ERROR_NOTFOUND: 404,
    INTERNAL_ERROR: 500,
} as const;

export type ResponseCode = (typeof ResponseCode)[keyof typeof ResponseCode];