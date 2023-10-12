import { ServerResponse } from 'http';

/** Parses and displays a returned Discord error. */
export async function parseResponseError(
    response: Response,
    res: ServerResponse,
): Promise<void> {
    const errorData: string[] = [
        `Error ${response.status} - ${response.statusText}`,
    ];
    try {
        const error = (await response.json()) as {
            error: string;
            error_description: string;
        };

        if (error.error === 'invalid_grant') {
            errorData.push('You may have clicked on an expired link.');
        }

        errorData.push(JSON.stringify(error, undefined, 4));
    } catch (error) {
        errorData.push('No further data.');
    }

    // 502 is the correct status code here, but Cloudflare likes to send their
    // own file when the upstream server returns 502, which isn't very helpful.
    res.writeHead(500);
    res.end(errorData.join('\n'));
}
