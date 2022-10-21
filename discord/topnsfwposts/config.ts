import { IDiscordBot } from "types/IDiscordBot";


const botDefaultData: IDiscordBot = {
    name: "LeanBot",
    activityType: 1,
    activity: "mongodb?!",
    nsfwAutoPosterSettings: {
        channelId: "1029381113916956702",
        postsToFetch: 100,
        autoUpdater: true,
        postTime: '22:00',
        bannedSubs: [''],
        bannedUrls: [''],
    }
  }



  export default botDefaultData