interface RedditType  {
    data: {
        total_views: number;
        description: string;
        description_html: string;
        created: number;
        title: string;
        created_utc: number;
        button_cta: string;
        websocket_url: string;
        name: string;
        is_announcement: boolean;
        state: string;
        announcement_url: string;
        nsfw: boolean;
        viewer_count: number;
        num_times_dismissable: number;
        viewer_count_fuzzed: boolean;
        resources_html: string;
        id: string;
        resources: string;
        icon: string;
    }

}
export default RedditType