import { SiteError } from './SiteError.js';

interface BrokeAmounts {
    have: number;

    require: number;
}

/**
 * Error thrown when a user lacks the required balance to do an attempted
 * economy-related action.
 */
export class BrokeError extends SiteError<BrokeAmounts> {
    public override readonly statusCode = 402;

    public constructor(have: number, require: number) {
        super(
            'Insufficient funds',
            `You don't have enough balance to purchase these item(s).`,
            { have, require },
        );
    }
}
