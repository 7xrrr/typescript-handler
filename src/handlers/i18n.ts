import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

class I18n {
    defaultLang: string;
    translations: { [key: string]: any };

    constructor(defaultLang: string = 'en') {
        this.defaultLang = defaultLang;
        this.translations = {};
        this.loadTranslations();
    }

    loadTranslations(): void {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const localesPath = join(__dirname, '../lang/');
        const files = fs.readdirSync(localesPath);
        
        files.forEach(file => {
            const lang = file.split('.')[0];
            const content = fs.readFileSync(join(localesPath, file), 'utf-8');
            this.translations[lang] = JSON.parse(content);
        });
    }

    t(key: string, lang: string = this.defaultLang, variables: { [key: string]: string } = {}): string {
        const keys = key.split('.');
        let translation = this.findTranslation(keys, lang) || this.findTranslation(keys, this.defaultLang) || key;

        if (Object.keys(variables).length === 0) return translation;

        for (const [placeholder, value] of Object.entries(variables)) {
            translation = translation.replace(`{${placeholder}}`, value);
        }

        return translation;
    }

    findTranslation(keys: string[], lang: string): any {
        let currentObj = this.translations[lang];
        for (const key of keys) {
            if (!currentObj || !currentObj.hasOwnProperty(key)) {
                return null;
            }
            currentObj = currentObj[key];
        }
        return currentObj;
    }
}

export default I18n;
