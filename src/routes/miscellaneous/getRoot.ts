import { Endpoint } from '../../types/index.js';

export const getRoot: Endpoint<void, string> = (_req, res) => {
    res.status(200).send(
        `You found the FoundationX API!<br />Having a look around? Check out the <a href="/api-docs">API documentation!</a>`,
    );
};
