import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { useSettings } from "../utils/settings";

const data = new SlashCommandBuilder()
  .setName("updatesetup")
  .setDescription("Permet d'ajouter les rôles spéciaux")
  .addRoleOption((option) =>
    option
      .setName("add-role")
      .setDescription("Role spécial ayant accès aux tickets")
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
  const roleId = interaction.options.get("add-role")?.role?.id!;

  if (settings == null)
    return interaction.reply({
      content: "Une erreur est survenue",
      ephemeral: true,
    });

  settings.specialRoleId = roleId;
  useSettings().update(settings!);

  interaction.reply({
    content: "La mise à jour a été effectuée",
    ephemeral: true,
  });
}

export default {
  data,
  execute,
};
