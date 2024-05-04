import {
  APIApplicationCommandOptionChoice,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { TypeTicketCitizen, useSettings } from "../utils/settings";

let choices: any = [];

const settings = useSettings().load();

if (
  settings != null &&
  settings.accessRules &&
  settings.accessRules.length > 0
) {
  choices = Object.values(settings.accessRules).map((ar) => {
    return { name: ar.name, value: ar.name };
  });
}

const data = new SlashCommandBuilder()
  .setName("removerule")
  .setDescription("Permet de retirer des règles d'accès aux tickets")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Nom de la règle a supprimer")
      .addChoices(...choices)
      .setRequired(true)
  );

async function execute(interaction: CommandInteraction) {
  if (!interaction.memberPermissions?.has("ManageChannels")) {
    return interaction.reply({
      content: "Vous n'avez pas la permission d'éxécuter cette commande",
      ephemeral: true,
    });
  }

  if (settings == null)
    return interaction.reply({
      content: "Une erreur est survenue",
      ephemeral: true,
    });

  if (!settings.accessRules || !(settings.accessRules.length > 0)) {
    return interaction.reply({
      content: "Rien à supprimer",
      ephemeral: true,
    });
  }

  settings.accessRules = settings.accessRules.filter(
    (ar) => ar.name !== interaction.options.get("name")!.value!.toString()
  );

  useSettings().update(settings!);

  interaction.reply({
    content: "La règle a bien été supprimée si elle existait",
    ephemeral: true,
  });
}

export default {
  data,
  execute,
};
