import {
  CommandInteraction,
  SlashCommandBuilder,
  TextChannel,
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ChannelType,
} from "discord.js";
import { useSettings } from "../utils/settings";
import { useLogger } from "../utils/logger";

const data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Met en place le bot")
  .addChannelOption((option) =>
    option
      .setName("chanel-citizen")
      .setDescription("Channel Citoyens")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("chanel-employee")
      .setDescription("Channel Employes")
      .setRequired(true)
  )
  .addRoleOption((option) =>
    option
      .setName("role-access")
      .setDescription("Role ayant accès aux tickets")
      .setRequired(true)
  );

async function execute(interaction: CommandInteraction) {
  const settings = useSettings().load();

  if (!interaction.memberPermissions?.has("ManageChannels")) {
    return interaction.reply({
      content: "Vous n'avez pas la permission d'éxécuter cette commande",
      ephemeral: true,
    });
  }

  if (settings != null && settings.setupDone) {
    return interaction.reply({
      content: "La mise en place a déjà été effectuée.",
      ephemeral: true,
    });
  }

  const chanelCitizen = interaction.options.get("chanel-citizen")
    ?.channel as TextChannel;
  const chanelEmployee = interaction.options.get("chanel-employee")
    ?.channel as TextChannel;

  // Création du message Citoyens

  const embedCitizen = new EmbedBuilder()
    .setColor(0xff4a21)
    .setTitle("Sélectionnez le sujet de votre ticket ci-dessous")
    .setAuthor({
      name: "EMS Tickets citoyens",
      iconURL:
        "https://cdn.discordapp.com/attachments/1227046138264162356/1227061733072310352/logohopital3.png?ex=6627094a&is=6614944a&hm=f640f54e007e0b8d5fef6da4a6834f00230e8e5a5b64d410c61b93d73967f813&",
    })
    .setDescription(
      "🔖 · **Demande de rôles** \n *Pour les demandes de rôles* \n ⏳ · **Suggestions** \n *Pour toutes idées,ajouts,..., pour l'hôpital.* \n 🎯 · **Prise de rendez-vous** \n *Pour rencontrer la direction de l'hôpital ou le psychologue ou autre,...* \n ❓ · **Questions** \n *Pour toutes questions générales* \n ⚠️ · **Problèmes** \n *Pour toutes remontées, envers un EMS ou autre.* \n 🤝 · **Partenariats** \n *Pour une entreprise qui souhaiterait passer un accord avec les EMS.*"
    );

  const selectCitizen = new StringSelectMenuBuilder()
    .setCustomId("citizen")
    .setPlaceholder("Choisissez...")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("🔖 · Demande de rôles")
        .setValue("role"),
      new StringSelectMenuOptionBuilder()
        .setLabel("⏳ · Suggestions")
        .setValue("suggestion"),
      new StringSelectMenuOptionBuilder()
        .setLabel("🎯 · Prise de rendez-vous")
        .setValue("rdv"),
      new StringSelectMenuOptionBuilder()
        .setLabel("❓ · Questions")
        .setValue("questions"),
      new StringSelectMenuOptionBuilder()
        .setLabel("⚠️ · Problèmes")
        .setValue("problem"),
      new StringSelectMenuOptionBuilder()
        .setLabel("🤝 · Partenariats")
        .setValue("partner")
    );

  const rowCitizen = new ActionRowBuilder().addComponents(selectCitizen);

  await chanelCitizen.send({
    embeds: [embedCitizen],
    components: [rowCitizen as any],
  });

  // Création du message EMS

  const embedEMS = new EmbedBuilder()
    .setColor(0xff4a21)
    .setTitle("Sélectionnez le sujet de votre ticket ci-dessous")
    .setAuthor({
      name: "EMS Tickets employés",
      iconURL:
        "https://cdn.discordapp.com/attachments/1227046138264162356/1227061733072310352/logohopital3.png?ex=6627094a&is=6614944a&hm=f640f54e007e0b8d5fef6da4a6834f00230e8e5a5b64d410c61b93d73967f813&",
    })
    .setDescription(
      "💡 · **Suggestions** \n *Pour toutes idées, ajouts,..., pour l'hôpital.* \n 🔑 · **Demande de formation** \n *Pour les demandes de formations.* \n ⚠️ · **Problèmes** \n *Pour les problèmes, à voir directement avec la direction*"
    );

  const selectEMS = new StringSelectMenuBuilder()
    .setCustomId("employees")
    .setPlaceholder("Choisissez...")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("💡 · Suggestions")
        .setValue("suggestion-ems"),
      new StringSelectMenuOptionBuilder()
        .setLabel("🔑 · Demande de formation")
        .setValue("formation"),
      new StringSelectMenuOptionBuilder()
        .setLabel("⚠️ · Problèmes")
        .setValue("problem-ems")
    );

  const rowEMS = new ActionRowBuilder().addComponents(selectEMS);

  await chanelEmployee.send({
    embeds: [embedEMS],
    components: [rowEMS as any],
  });

  // Création des catégories

  const citizenCat = await interaction.guild?.channels.create({
    name: "Tickets citoyens",
    type: ChannelType.GuildCategory,
  });

  const emsCat = await interaction.guild?.channels.create({
    name: "Tickets EMS",
    type: ChannelType.GuildCategory,
  });

  try {
    useSettings().save({
      setupDone: true,
      channelCitizen: chanelCitizen.id,
      channelEmployee: chanelEmployee.id,
      categoryCitizen: citizenCat!.id,
      categoryEmployee: emsCat!.id,
      roleAccessId: interaction.options.get("role-access")?.role?.id!,
    });
  } catch (e) {
    useLogger().error(JSON.stringify(e), "setup.ts/#138");
  }

  return interaction.reply({
    content: "Mise en place effectuée",
    ephemeral: true,
  });
}

export default {
  data,
  execute,
};
