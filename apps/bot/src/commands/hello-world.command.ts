import { AppCommand, SlashCommand, SlashCommandContext } from '@app/commands'
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle } from 'discord.js'
import { AppCommandType } from '@app/constants'
import { idOf, makeCustomId } from '@app/utils'
import { HelloButtonCommand } from './hello-button.command'

@AppCommand({
  name: 'hello', // this should be unique across all commands.
  description: 'world',
  type: ApplicationCommandType.ChatInput,
})
export class HelloWorldCommand implements SlashCommand {
  public readonly type = AppCommandType.Slash

  async handle(ctx: SlashCommandContext) {
    const row = new ActionRowBuilder<ButtonBuilder>()

    const helloButton = new ButtonBuilder()
      // on click, the button will trigger the HelloButtonCommand and pass the timestamp of HelloWorldCommand call.
      .setCustomId(makeCustomId(idOf(HelloButtonCommand), Date.now(), 1))
      .setStyle(ButtonStyle.Primary)
      .setLabel('Hello!')

    // latency may show -1ms when the bot is just started
    const latencyButton = new ButtonBuilder()
      .setCustomId('latency')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
      .setLabel(`Ping: ${ctx.client.ws.ping}ms`)

    row.addComponents(helloButton, latencyButton)

    return ctx.interaction.reply({
      content: `### :wave: Hello, world!`,
      components: [ row ],
      ephemeral: true
    })
  }
}
