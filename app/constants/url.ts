import Constants from "expo-constants";
const PORT = "3000";
const SERVER_URI = Constants?.expoConfig?.hostUri
  ? Constants.expoConfig.hostUri.split(`:`).shift()!.concat(`:${PORT}`)
  : `actualproduction.com`;
const PROTOCOL = process.env.NODE_ENV === `development` ? `http` : `https`;

export const API_URL = `${PROTOCOL}://${SERVER_URI}`;
