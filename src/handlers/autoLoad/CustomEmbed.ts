import { EmbedBuilder as OriginalEmbedBuilder } from "discord.js";
import config from "../../config.js";


class EmbedBuilder extends OriginalEmbedBuilder {
    constructor() {
        super();
        this.setColor(this.data?.color || `#${config.embedColor.replaceAll("#","")}`);
        
    }
}


declare module "discord.js" {
    export interface EmbedBuilder {
        customMethod(): void; 
    }
}


export default EmbedBuilder;
