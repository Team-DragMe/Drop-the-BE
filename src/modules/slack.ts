import axios from 'axios';
import { env } from '../config';

export const sendMessageToSlack = async (message: string): Promise<void> => {
  try {
    await axios.post(env.slackWebHookURL, { text: message });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
