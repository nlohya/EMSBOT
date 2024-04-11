import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { useLogger } from "./utils/logger";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST().setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    useLogger().info("Refreshing slash commands...", "deploy-commands.ts/#16");

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    useLogger().info(
      "Successfully reloaded slash commands",
      "deploy-commands.ts/#25"
    );
  } catch (error) {
    useLogger().error(error as string, "deploy-commands.ts/#27");
  }
}
