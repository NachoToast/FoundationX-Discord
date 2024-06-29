/** Special error class only thrown by {@link awaitOrTimeout}. */
export class TimeoutError extends Error {
    private readonly seconds: number;

    public constructor(seconds: number) {
        super();
        this.seconds = seconds;
    }

    public makeMessage(actionName: string): string {
        return `Took too long to ${actionName} (max ${this.seconds.toString()}s)`;
    }
}

/**
 * Waits for a promise to resolve in the given number of seconds.
 * @throws Throws a {@link TimeoutError} if the promise does not resolve in
 * {@link timeoutSeconds}.
 */
export async function awaitOrTimeout<T>(
    promise: Promise<T>,
    timeoutSeconds: number,
): Promise<T> {
    if (!Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0) {
        return await promise;
    }

    let timeout: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<TimeoutError>((resolve) => {
        timeout = setTimeout(() => {
            resolve(new TimeoutError(timeoutSeconds));
        }, timeoutSeconds * 1_000);
    });

    const firstResult = await Promise.race([promise, timeoutPromise]);

    clearTimeout(timeout);

    if (firstResult instanceof TimeoutError) {
        throw firstResult;
    }

    return firstResult;
}
