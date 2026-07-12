import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { SlackChannelEnums } from '../enums/slack.enum';

type Channel = {
  id: string;
  name: string;
};

type SlackConversationsListResponse = {
  channels: Channel[];
};

@Injectable()
export class SlackService {
  private SLACK: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.SLACK = axios.create({
      baseURL: `https://slack.com/api`,
      headers: {
        Authorization: `Bearer ${process.env.SLACK_API_KEY}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    this.SLACK.interceptors.request.use((config) => {
      return config;
    });

    this.SLACK.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        throw error;
      },
    );
  }

  /**
   * Find the channel name
   * @param name
   */
  async findChannel(name?: string): Promise<any> {
    const { channels }: SlackConversationsListResponse = await this.SLACK.get(
      '/conversations.list',
    );
    // for (const channel of channels) {
    //   if (channel.name === name) {
    //     return {
    //       name,
    //       id: channel.id,
    //     };
    //   }
    // }
    return channels;
    // throw new Error('Channel not found');
  }

  getEnvironmentEmoji = (env: string): string => {
    switch (env) {
      case 'development':
        return ':hammer_and_wrench:';
      case 'staging':
        return ':test_tube:';
      case 'production':
        return ':rocket:';
      default:
        return ':information_source:';
    }
  };

  async send(data: any): Promise<any> {
    try {
      const { channel, text, username, blocks } = data;

      const emoji = this.getEnvironmentEmoji(
        this.configService.get('NODE_ENV'),
      );
      const _channel =
        this.configService.get('NODE_ENV') === 'production'
          ? channel
          : SlackChannelEnums.TAIWO;

      const payload = {
        channel: channel,
        icon_emoji: emoji,
        username: `3XG.Africa - ${this.configService.get('NODE_ENV')}`,
        text: text || undefined,
        blocks: blocks || undefined,
        attachments: [],
        unfurl_links: false,
      };

      const response = await this.SLACK.post(`/chat.postMessage`, payload);

      console.log(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * more formatting https://api.slack.com/reference/surfaces/formatting
   */
}
