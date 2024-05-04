import {
  APIApplicationCommandOptionChoice,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { TypeTicketCitizen, useSettings } from "../utils/settings";

const choices = Object.values(TypeTicketCitizen).map((t) => {
  return { name: t.toUpperCase(), value: t.toString() };
});

const data = new SlashCommandBuilder()
  .setName("addrule")
  .setDescription("Permet d'ajouter des règles d'accès aux tickets")
  .addStringOption((option) =>
    option.setName("name").setDescription("Nom de la règle").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("id").setDescription("ID rôle à ajouter").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("Type du ticket à ajouter")
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

  const settings = useSettings().load();

  if (settings == null)
    return interaction.reply({
      content: "Une erreur est survenue",
      ephemeral: true,
    });

  if (!settings.accessRules) {
    settings.accessRules = [];
  }

  if (settings.accessRules.length > 0) {
    for (let ar of settings.accessRules) {
      if ((ar.name = interaction.options.get("name")!.value!.toString())) {
        return interaction.reply({
          content: "Le nom de la règle est déjà utilisé",
          ephemeral: true,
        });
      }
    }
  }

  settings.accessRules.push({
    name: interaction.options.get("name")!.value!.toString(),
    acessId: interaction.options.get("id")!.value!.toString(),
    type: interaction.options
      .get("type")!
      .value!.toString() as TypeTicketCitizen,
  });

  useSettings().update(settings!);

  interaction.reply({
    content: "La règle a bien été ajoutée",
    ephemeral: true,
  });
}

export default {
  data,
  execute,
};
