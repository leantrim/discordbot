export interface IDiscordBot {
  name?: string ;
  activityType?: number;
  activity?: string;
  nsfwAutoPosterSettings: {
      channelId?: string;
      postsToFetch?: number;
      autoUpdater?: boolean;
      lastUpdated?: Date;
      bannedSubs?: [string];
      bannedUrls?: [string];
      postList?: [string];
      postTime?: string;
  }
}
