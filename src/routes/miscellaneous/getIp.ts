import { Endpoint } from '../../types/index.js';

export const getIp: Endpoint<void, string> = (req, res) => {
    res.status(200).send(req.ip);
};
