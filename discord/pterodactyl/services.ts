import axios from "axios";

const getPanelRequest = async (url: string) => {
    try {
        const { data } = await axios.get(`${process.env.PTERODACTYL_PANEL_URL}/${url}`, {
            headers: {
                'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
            },
        }); return data.data;
        } catch (error) {
            console.error(error);
        }
}

const formatSteamAutoJoinLink = (ip: String, port: Number, password: String) => {
  const url = `steam://connect/${ip}:${port}/${password}`
  return url;
}

const exportObject = {
    getPanelRequest,
    formatSteamAutoJoinLink
};
export default exportObject;