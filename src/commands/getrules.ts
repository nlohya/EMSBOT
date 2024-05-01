import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { useSettings } from "../utils/settings";

const data = new SlashCommandBuilder()
  .setName("getrules")
  .setDescription("Permet de montrer les règles existantes");

async function execute(interaction: CommandInteraction) {
  if (!interaction.memberPermissions?.has("MoveMembers")) {
    return interaction.reply({
      content: "Vous n'avez pas la permission d'éxécuter cette commande",
      ephemeral: true,
    });
  }

  const settings = useSettings().load();

  if (settings == null)
    return interaction.reply({
      content: "Une erreur est survenue",
      ephemeral: true,
    });

  let reply = "";

  if (settings.accessRules && settings.accessRules.length > 0) {
    settings.accessRules.forEach((ar) => {
      reply += `<@&${ar.acessId}> a accès au type : ${ar.type} \n`;
    });
  } else {
    reply = "Aucune règle n'a été appliquée";
  }

  interaction.reply({
    content: reply,
    ephemeral: false,
  });
}

export default {
  data,
  execute,
};
