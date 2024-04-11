import { Client, TextChannel } from "discord.js";
import { useLogger } from "./utils/logger";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import { Message } from "discord.js";
import { GatewayIntentBits } from "discord.js";
import { selectCitizen } from "./select_handlers/select-citizen";
import { selectEms } from "./select_handlers/select-ems";
import { useSettings } from "./utils/settings";

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

client.once("ready", async () => {
  useLogger().info("Bot is ready", "index.ts/#11");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    commands[interaction.commandName as keyof typeof commands].execute(
      interaction
    );
  } else if (interaction.isAnySelectMenu()) {
    if (interaction.customId === "citizen") {
      selectCitizen.handle(interaction);
    } else if (interaction.customId === "employees") {
      selectEms.handle(interaction);
    }
  }
});

client.on("messageCreate", async (message: Message<boolean>) => {
  if (message.content === ".debug") {
    if (!(message.author.id === "619832422766477327")) return;

    await deployCommands({ guildId: message.guild?.id! });
    await message.reply("Reloaded slash commands");
  }

  if (message.content === ".close") {
    const settings = useSettings().load();

    if (settings == null || !settings.setupDone) return;

    if (
      !message.guild?.roles.cache
        .find((r) => r.id === settings.roleAccessId)
        ?.members.find((m) => m.id === message.author.id)
    ) {
      const answer = await message.reply({
        content:
          "Vous n'avez pas la permission de fermer votre ticket, attendez que quelqu'un le fasse pour vous !",
      });
      await message.delete();
      await sleep(5000);
      await answer.delete();
      return;
    }

    if (!(message.channel as TextChannel).name.includes("__ticket")) return;

    await message.channel.delete();
  }
});

client.login(config.DISCORD_TOKEN);
