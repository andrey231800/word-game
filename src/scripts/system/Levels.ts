import { LevelData } from '../types/LevelData';

//Load json configuration levels and transform words into all possible letters needed to compose any word

class LevelsClass  {
    constructor() {

    }

    get(maxLevel: number) {
        return this.create(maxLevel);
    }

    create(maxLevel: number) {

        const arr = [];

        for (let i = 1; i <= maxLevel ; i++) {
            const data =  this.getFromJSON(i);

            if(data) {
                const levelWords = this.pickLettersFromTheWords(data)

                arr.push(levelWords);
            }

        }

        return arr;
    }

    getFromJSON(level: number = 1) {

        const json = require(`../../json/level_${level}.json`);

        return json.words;
    }

    pickLettersFromTheWords(words: string[]): LevelData {

        const letterFrequency: Map<string, number> = new Map();

        words.forEach(word => {

            const frequency: Map<string, number> = new Map();

            word.split('').forEach(letter => {
                frequency.set(letter, (frequency.get(letter) || 0) + 1);
            });

            frequency.forEach((count, letter) => {
                letterFrequency.set(letter, Math.max(letterFrequency.get(letter) || 0, count));
            });

        });

        let lettersVariants: string[] = [];

        letterFrequency.forEach((count, letter) => {

            for (let i = 0; i < count; i++) {
                lettersVariants.push(letter.toUpperCase());
            }

        });

        return {
            words: words,
            variants: lettersVariants,
        };
    }
}

export const Levels = new LevelsClass();