"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const getPanelRequest = async (url) => {
    try {
        const { data } = await axios_1.default.get(`${process.env.PTERODACTYL_PANEL_URL}/${url}`, {
            headers: {
                'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
            },
        });
        return data.data;
    }
    catch (error) {
        console.error(error);
    }
};
const formatSteamAutoJoinLink = (ip, port, password) => {
    const url = `steam://connect/${ip}:${port}/${password}`;
    return url;
};
const exportObject = {
    getPanelRequest,
    formatSteamAutoJoinLink
};
exports.default = exportObject;
