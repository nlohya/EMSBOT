import {
  CommandInteraction,
  Message,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = new SlashCommandBuilder()
  .setName("picksuperwinner")
  .setDescription("Permet de choisir un gagnant ultime")
  .addStringOption((option) =>
    option
      .setName("message-id")
      .setDescription("ID du message du giveaway")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("msg-channel")
      .setDescription("Channel où se situe le message du giveaway")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Channel où envoyer le super gagnant")
      .setRequired(true)
  );

async function execute(interaction: CommandInteraction) {
  if (!interaction.memberPermissions?.has("ManageChannels")) {
    return interaction.reply({
      content: "Vous n'avez pas la permission d'éxécuter cette commande",
      ephemeral: true,
    });
  }

  const channel = interaction.options.get("channel")?.channel as TextChannel;
  const msgChannel = interaction.options.get("msg-channel")
    ?.channel as TextChannel;
  const messageId = interaction.options.get("message-id")?.value;

  let message: Message | undefined = await msgChannel.messages.fetch(
    messageId!.toString()
  );

  if (!message) {
    return interaction.reply({
      content: "Une erreur est survenue",
      ephemeral: true,
    });
  }

  let winner = message.mentions.users.at(
    randomIntFromInterval(0, message.mentions.users.size - 1)
  );

  await channel.send(`<@${winner?.id}> est le super gagnant !`);

  return interaction.reply({
    content: `<@${winner?.id}> est le super gagnant`,
    ephemeral: true,
  });
}

export default {
  data,
  execute,
};
