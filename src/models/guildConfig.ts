import mongoose, { Schema, Document } from 'mongoose';
import config from '../config.js';

interface IGuildConfig extends Document {
  guildId: string;
  lang: string;
  prefix: string;
  createdAt: Date;
  updatedAt: Date;
}

const guildConfigSchema: Schema = new Schema(
  {
    guildId: {
      required: true,
      type: String,
    },
    lang: {
      type: String,
      default: 'ar',
    },
    prefix: {
      type: String,
      default: config.prefix,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const GuildConfig = mongoose.model<IGuildConfig>('GuildConfig', guildConfigSchema);

export default GuildConfig;
