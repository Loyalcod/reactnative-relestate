import "react-native-url-polyfill/auto";

import { Account, Client, Databases } from "react-native-appwrite";

import { appwriteConfig } from "@/constants/appwrite";

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const appwriteClient = client;
export const account = new Account(client);
export const database = new Databases(client);
