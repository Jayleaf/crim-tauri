export default function parse(action, code)
{
    switch (code)
    {
        case 200:
            return `Operation ${action} successful.`;
        case 400:
            return `Bad request: ${action} failed due to an incorrectly formatted packet/request.`;
        case 401:
            return `Unauthorized: ${action} failed due to an invalid session ID.`;
        case 403:
            return `Forbidden: ${action} failed due to a lack of presence in data.`;
        case 404:
            return `Not Found: ${action} failed due to a non-existent entity.`;
        case 500:
            return `Internal Server Error: ${action} failed due to an internal server error.`;
        case 501:
            return `Not Implemented: ${action} failed due to the requested feature not being implemented.`;
        default:
            return `Unknown error: ${action} failed due to an unknown error.`;
    }
}