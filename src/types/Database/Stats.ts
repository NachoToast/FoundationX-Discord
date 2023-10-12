export interface Stats {
    /** Steam ID 64 */
    _id: string;

    Deaths: number;

    DeathsToFallDamage: number;

    DeathsToSuicide: number;

    DeathsToTesla: number;

    DeathsToGod: number;

    KillsAgainstPlayers: number;

    KillsAgaisntSCPs: number;

    KillsAgaisntCuffedPlayers: number;

    KillsAgaisntShyGuy: number;

    KillsWithJailbird: number;

    KillsWithMicro: number;

    KillsWithFunnyGun: number;

    GrenadesThrown: number;

    MedkitsUsed: number;

    PainkillersUsed: number;

    CasesUnlocked: number;

    ColasEaten: number;

    PepsisEaten: number;

    HatsWorn: number;

    TimesUncuffed: number;

    DoorsTouched: number;

    /** In seconds. */
    LongestSession: number;

    /** In seconds. */
    TotalPlaytime: number;
}
