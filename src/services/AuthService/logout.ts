import { revokeAccessToken } from './core/revokeAccessToken.js';
import { validateSiteToken } from './core/validateSiteToken.js';

export async function logout(siteToken?: string): Promise<void> {
    const { accessToken } = validateSiteToken(siteToken);

    await revokeAccessToken(accessToken);
}
