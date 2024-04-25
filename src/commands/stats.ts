import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Database } from "../database/database";
import { promisify } from "node:util";

const getAmount = async (type: string) => {
  const query = promisify(Database.instance().connection()?.query!).bind(
    Database.instance().connection(),
  );

  return await query(`SELECT count(*) as c FROM log WHERE type = '${type}'`);
};

const getInfoAmount = async (): Promise<number> => {
  return ((await getAmount("INFO")) as Array<{ c: number }>)[0]["c"];
};

const getWarnAmount = async (): Promise<number> => {
  return ((await getAmount("WARN")) as Array<{ c: number }>)[0]["c"];
};

const getErrorAmount = async (): Promise<number> => {
  return ((await getAmount("ERROR")) as Array<{ c: number }>)[0]["c"];
};

const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Donne les statistiques du bot");

async function execute(interaction: CommandInteraction) {
  if (!interaction.memberPermissions?.has("MoveMembers")) {
    return interaction.reply({
      content: "Vous n'avez pas la permission d'éxécuter cette commande",
      ephemeral: true,
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0x1eaaf1)
    .setTitle("Statistiques du BOT EMS")
    .setAuthor({
      name: "EMS Utilities",
      iconURL:
        "https://cdn.discordapp.com/attachments/1227046138264162356/1227061733072310352/logohopital3.png?ex=6627094a&is=6614944a&hm=f640f54e007e0b8d5fef6da4a6834f00230e8e5a5b64d410c61b93d73967f813&",
    })
    .setDescription(
      "__Logs__ \n" +
        `Infos : ${await getInfoAmount()} \n` +
        `Warns : ${await getWarnAmount()} \n` +
        `Errors : ${await getErrorAmount()} \n`,
    );

  return interaction.reply({
    embeds: [embed],
    ephemeral: false,
  });
}

export default {
  data,
  execute,
};
