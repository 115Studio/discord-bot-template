import { AppCommand, ButtonCommand, ButtonCommandContext } from '@app/commands'
import { AppCommandType } from '@app/constants'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { idOf, makeCustomId } from '@app/utils'

@AppCommand({
  name: 'hello-button', // this should be unique across all commands.
})
export class HelloButtonCommand implements ButtonCommand {
  public readonly type = AppCommandType.Button

  async handle(ctx: ButtonCommandContext) {
    const ts = Number(ctx.args[1])
    const iterations = Number(ctx.args[2] || 0)

    const timeRelative = Date.now() - ts
    const ago = timeRelative < 1000 ? `${timeRelative}ms` : `${Math.round(timeRelative / 1000)}s`

    const msg = iterations > 1
      ? `You clicked the button ${iterations} times! Last click was ${ago} ago.`
      : `You called /hello ${ago} ago.`

    const row = new ActionRowBuilder<ButtonBuilder>()

    const button = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel(iterations > 1 ? 'Click again!' : 'Click!')
      .setCustomId(makeCustomId(idOf(HelloButtonCommand), Date.now(), iterations + 1))

    row.addComponents(button)

    return ctx.interaction.reply({
      content: `### :tada: Click! \n${msg}`,
      components: [ row ],
      ephemeral: true,
    })
  }
}
