const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { REST, Routes } = require("discord.js")
const deployCommands = async () => {
    try {
        const commands = []
        const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"))
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`)
            if ("data" in command && "execute" in command) {
                commands.push(command.data.toJSON())
            } else {
                console.log(`WARNING: The command at ${file} is missing a required 'data' or 'execute' property.`)
            }
        }

        const rest = new REST().setToken(process.env.BOT_TOKEN)

        console.log("started refreshing application slash commands globally")

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        )

        console.log("successfully reloaded all commands!")
    } catch (error) {
        console.error(error)
    }

}

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ActivityType,
    PresenceUpdateStatus,
    Events
} = require("discord.js")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember
    ]
})

client.commands = new Collection()

const fs = require("fs")
const path = require("path")

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    } else {
        console.log(`${filePath} is missing data or execute properties`)
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`Ready; logged in as ${client.user.tag}`)
    await deployCommands()
    console.log("Commands deployed globally!")
    const statusType = process.env.BOT_STATUS || "Online"
    const activityType = process.env.ACTIVITY_TYPE || "PLAYING"
    const activityName = process.env.ACTIVITY_NAME || "Discord"
    
    const activityTypeMap = {
        "PLAYING": ActivityType.Playing,
        "WATCHING": ActivityType.Watching,
        "LISTENING": ActivityType.Listening,
        "STREAMING": ActivityType.Streaming,
        "COMPETING": ActivityType.Competing
    }

    const statusMap = {
        "online": PresenceUpdateStatus.Online,
        "idle": PresenceUpdateStatus.Idle,
        "dnd": PresenceUpdateStatus.DoNotDisturb,
        "invisible": PresenceUpdateStatus.Invisible
    }

    client.user.setPresence({
        status: statusMap[statusType],
        activities: [{
            name: activityName,
            type: activityTypeMap[activityType]
        }]
    })

    console.log(`Bot status applied! Activity type set to ${activityType}`)
})

client.on(Events.InteractionCreate, async interaction => {
    try {
        // 1️⃣ Handle slash commands (like /ping)
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.log("Command not found:", interaction.commandName);
                return;
            }
            await command.execute(interaction);
            return; // stop here so we don't process as a button
        }

        if (interaction.isButton()) {
            const [first, ...args] = interaction.customId.split(":");

            const [action, type] = first.split("_")

            console.log("On Interaction receive:", action, type, args)

            if (action === "approve" && type === "course") {
                const [subjectId, courseName] = args;

                await fetch(`${process.env.SPRING_URL}/admin/approve-course`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.ADMIN_KEY,
                    },
                    body: JSON.stringify({ subjectId: subjectId, name: courseName }),
                });

                await interaction.update({
                    content: `✅ Approved **${courseName}** for **${subjectId}**.`,
                    components: [],
                });
            } else if (action === "approve" && type === "professor") {
                const [courseId, professorName] = args;

                await fetch(`${process.env.SPRING_URL}/admin/approve-professor`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.ADMIN_KEY,
                    },
                    body: JSON.stringify({ courseId, name: professorName }),
                });

                await interaction.update({
                    content: `✅ Approved professor **${professorName}**.`,
                    components: [],
                });
            } else if (action === "deny") {
                await interaction.update({
                    content: `❌ Denied request.`,
                    components: [],
                });
            }
        }
    } catch (error) {
        console.error(error);
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: "⚠️ There was an error handling this interaction.", ephemeral: true });
            } else {
                await interaction.reply({ content: "⚠️ There was an error handling this interaction.", ephemeral: true });
            }
        } catch (err2) {
            console.error("Failed to send error response:", err2);
        }
    }
})

client.login(process.env.BOT_TOKEN)



//////////////////////////////////////////////////////////



const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const DISCORD_SECRET = process.env.DISCORD_SECRET;

app.post("/notify-course", async (req, res) => {
  const { secret, subjectName, subjectId, name: courseName, userId } = req.body;
  if (secret !== DISCORD_SECRET) return res.status(403).send("Forbidden");

  try {
    const embed = new EmbedBuilder()
      .setTitle("📚 New Course Request")
      .setDescription(
        `**Subject Name:** ${subjectName}\n**Subject ID:** ${subjectId}\n**Proposed Course Name:** ${courseName}\nRequsted by user ID ${userId}`
      )
      .setColor(0x0099ff)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`approve_course:${subjectId}:${courseName}`)
        .setLabel("Approve ✅")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`deny_course:${subjectId}:${courseName}`)
        .setLabel("Deny ❌")
        .setStyle(ButtonStyle.Danger)
    );

    const channel = await client.channels.fetch(process.env.COURSE_CHANNEL_ID);
    await channel.send({ embeds: [embed], components: [row] });

    res.status(200).send("✅ Course request sent to Discord");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending course message");
  }
});

app.post("/notify-professor", async (req, res) => {
  const { secret, courseName, courseId, name: professorName, userId } = req.body;
  if (secret !== DISCORD_SECRET) return res.status(403).send("Forbidden");

  try {
    const embed = new EmbedBuilder()
      .setTitle("👨‍🏫 New Professor Submission")
      .setDescription(
        `**Professor Name:** ${professorName}\n**Course Name:** ${courseName}\n**Course ID:** ${courseId}\nRequsted by user ID ${userId}`
      )
      .setColor(0x1abc9c)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`approve_professor:${courseId}:${professorName}`)
        .setLabel("Approve ✅")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`deny_professor:${courseId}:${professorName}`)
        .setLabel("Deny ❌")
        .setStyle(ButtonStyle.Danger)
    );

    const channel = await client.channels.fetch(process.env.COURSE_CHANNEL_ID);
    await channel.send({ embeds: [embed], components: [row] });

    res.status(200).send("✅ Professor request sent to Discord");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending professor message");
  }
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`HTTP server listening on port ${PORT}`));