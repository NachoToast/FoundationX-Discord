import { ChatInputCommandInteraction } from 'discord.js';
import { ItemReward } from '../../../public/EconomyReward.js';
import { EconomyService } from '../../../services/index.js';
import { Command } from './Command.js';

export class PayoutsCommand extends Command {
    public constructor() {
        super('payouts', 'Check your pending reward payouts');
    }

    public override async onInvoke(
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        const payouts = await EconomyService.getPayoutsByDiscordId(
            interaction.user.id,
        );

        const rewards = EconomyService.getAllRewards();

        const rewardCounts = new Map<ItemReward, number>();

        let totalCount = 0;

        for (const payout of payouts) {
            console.log(
                payout._id,
                rewards.find((e) => e.id === payout.rewardId)?.title,
            );

            const reward = rewards.find((e) => e.id === payout.rewardId);

            if (reward === undefined) continue;

            totalCount++;

            let count = rewardCounts.get(reward);

            if (count !== undefined) {
                count++;
            } else {
                count = 1;
            }

            rewardCounts.set(reward, count);
        }

        if (totalCount === 0) {
            await interaction.reply({
                content: 'You have no pending payouts.',
            });

            return;
        }

        const output: string[] = [
            `You have ${totalCount.toString()} pending payout${totalCount !== 1 ? 's' : ''}:`,
        ];

        if (rewardCounts.size > 10) {
            output.push(Array.from(rewardCounts.values()).join(', '));
        } else {
            for (const [reward, count] of rewardCounts) {
                output.push(`- ${reward.title} x${count.toString()}`);
            }
        }

        await interaction.reply({
            content: output.join('\n'),
        });
    }
}
