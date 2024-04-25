import { AnySelectMenuInteraction, inlineCode } from "discord.js";
import { useLogger } from "../utils/logger";
import { useSettings } from "../utils/settings";
import { query } from "../database";

function reason(str: string) {
  switch (str) {
    case "suggestion-ems":
      return "Suggestion";
    case "formation":
      return "Demande de formation";
    case "problem-ems":
      return "Problèmes";
    default:
      return "Non spécifié";
  }
}

export const handle = async (interaction: AnySelectMenuInteraction) => {
  useLogger().info(
    `User ${interaction.user.username} opened an EMS ticket, type: ${interaction.values[0]}`,
    "select-ems.ts/#5",
  );

  const settings = useSettings().load();

  if (settings == null || !settings.setupDone) {
    useLogger().error("Setup corrompu");
    return interaction.reply({
      content:
        "Contactez l'administration du serveur : l'insatallation est corrompue :(",
      ephemeral: true,
    });
  }

  const chanel = await interaction.guild?.channels.create({
    name: `${interaction.values[0]}__${interaction.user.username}__ticket`,
    parent: settings.categoryEmployee,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.cache.find((r) => r.name === "@everyone")
          ?.id!,
        deny: ["ViewChannel"],
      },
      {
        id: interaction.user.id,
        allow: ["ViewChannel"],
      },
      {
        id: settings.roleAccessId,
        allow: ["ViewChannel"],
      },
    ],
  });

  await chanel?.send({
    content: `<@&${settings.roleAccessId}>, l'EMS <@${
      interaction.user.id
    }> a ouvert un ticket pour la raison suivante : ${reason(
      interaction.values[0],
    )}, utilisez la commande ${inlineCode(".close")} pour fermer le ticket.`,
  });

  await query(
    `INSERT INTO ticket VALUES (null, null, '${interaction.values[0]}', '${interaction.user.id}', 'EMS')`,
  );

  return interaction.reply({
    content: `Votre ticket est ouvert : <#${chanel?.id}>`,
    ephemeral: true,
  });
};

export const selectEms = {
  handle,
};
