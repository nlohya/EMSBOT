import {
  AnySelectMenuInteraction,
  OverwriteData,
  PermissionOverwrites,
  inlineCode,
} from "discord.js";
import { useLogger } from "../utils/logger";
import { useSettings } from "../utils/settings";
import { query } from "../database";

function reason(str: string) {
  switch (str) {
    case "role":
      return "Demande de role";
    case "suggestion":
      return "Suggestion";
    case "rdv":
      return "Prise de rendez-vous";
    case "ppa":
      return "Test psychologique PPA";
    case "questions":
      return "Questions";
    case "problem":
      return "Problèmes";
    case "partner":
      return "Partenariat";
    default:
      return "Non spécifié";
  }
}

export const handle = async (interaction: AnySelectMenuInteraction) => {
  useLogger().info(
    `User ${interaction.user.username} opened a citizen ticket, type: ${interaction.values[0]}`,
    "select-citizen.ts/#5"
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

  let chanel = undefined;

  let additionnalPerms: Array<OverwriteData> = [];

  if (settings.accessRules) {
    for (let ar of settings.accessRules) {
      if (interaction.values[0] === ar.type) {
        additionnalPerms.push({
          id: ar.acessId.toString(),
          allow: ["ViewChannel"],
        });
      }
    }
  }

  chanel = await interaction.guild?.channels.create({
    name: `${interaction.values[0]}__${interaction.user.username}__ticket`,
    parent: settings.categoryCitizen,
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
      ...additionnalPerms,
    ],
  });

  let rolesToPing = "";

  additionnalPerms.forEach((ap) => {
    rolesToPing += `<@&${ap.id}>, `;
  });

  await chanel?.send({
    content: `<@&${settings.roleAccessId}>, ${rolesToPing} le citoyen <@${
      interaction.user.id
    }> a ouvert un ticket pour la raison suivante : ${inlineCode(
      reason(interaction.values[0])
    )}, utilisez la commande ${inlineCode(".close")} pour fermer le ticket.`,
  });

  await query(
    `INSERT INTO ticket VALUES (null, null, '${interaction.values[0]}', '${interaction.user.id}', 'CITIZEN')`
  );

  return interaction.reply({
    content: `Votre ticket est ouvert : <#${chanel?.id}>`,
    ephemeral: true,
  });
};

export const selectCitizen = {
  handle,
};
