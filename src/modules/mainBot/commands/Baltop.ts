import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { UserService } from '../../../services/index.js';
import { getBestName } from '../util/getBestName.js';
import { makeHistogramLine } from '../util/histogram.js';
import { medalGenerator } from '../util/medalGenerator.js';
import { Command } from './Command.js';

export class BaltopCommand extends Command {
    public constructor() {
        super('baltop', 'Check the richest 10 users');
    }

    public override async onInvoke(
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        const { embedColour } = AppGlobals.config.modules.mainBot;

        await interaction.deferReply();

        const [leaderboard, thisUser] = await Promise.all([
            UserService.getTopEarners(),
            UserService.getRank(interaction.user.id, 'economy.balance'),
        ]);

        if (leaderboard.length === 0) {
            await interaction.editReply({
                content: 'No users in the database',
            });
            return;
        }

        const output = new Array<string>(leaderboard.length);

        const maxValue = Math.max(...leaderboard.map((e) => e.economy.balance));

        const medals = medalGenerator();

        for (let i = 0; i < leaderboard.length; i++) {
            const user = leaderboard[i];

            if (user === undefined) {
                output[i] = '???';
                continue;
            }

            const { balance } = user.economy;

            output[i] =
                `${makeHistogramLine(balance, maxValue, 10, '')} ${medals.next().value} ${getBestName(user)} - ${balance.toLocaleString()}`;
        }

        if (
            thisUser?.rankingForStat !== undefined &&
            thisUser.rankingForStat > 10
        ) {
            if (thisUser.rankingForStat > 11) {
                output.push('...');
            }

            output.push(
                `${makeHistogramLine(thisUser.economy.balance, maxValue, 10, '')} **#${thisUser.rankingForStat.toString()}** ${getBestName(thisUser)} - ${thisUser.economy.balance.toLocaleString()}`,
            );
        }

        const embed = new EmbedBuilder()
            .setColor(embedColour)
            .setTitle(`Richest Users`)
            .setDescription(output.join('\n'));

        await interaction.editReply({ embeds: [embed] });

        // const users = await UserService.getTopEarners();

        // const output: string[] = [
        //     'The richest users are:',
        // ];

        // const usersAndBalances = new Map(users.map((user) => [user, user.economy.balance]));

        // const maxBalance = Math.max(...usersAndBalances.values());

        // const output: string[] = [
        //     ``
        // ]

        // await interaction.reply({
        //     content: output.join('\n'),
        // });
    }
}
