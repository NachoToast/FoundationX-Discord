import { parse } from 'node-html-parser';

export async function getSteamData(
    steamId: string,
): Promise<{ username?: string; profileUrl?: string }> {
    try {
        const data = await (
            await fetch(`http://steamcommunity.com/profiles/${steamId}`)
        ).text();

        const root = parse(data);

        const username = root
            .querySelector('.actual_persona_name')
            ?.innerText.trim();

        const profileUrl = root
            .querySelectorAll('img')
            .map((e) => e.attributes.src)
            .filter((e) => e.includes('avatars.'))
            .at(0);

        return { username, profileUrl };
    } catch (error) {
        return {};
    }
}
