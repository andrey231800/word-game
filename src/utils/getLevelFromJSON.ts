// import { LevelData } from '../types/LevelsData';

import { LevelData } from '../types/LevelData';

interface WordsObject {
    words: string[];
}

export async function getLevelFromJSON(level: number = 1) {

    const url = `assets/levels/${level}.json`;

    try {
        const response = await fetch(url);

        const data: WordsObject = await response.json();

        return data.words;

    } catch (error) {
        throw error instanceof Error ? error : new Error('Неизвестная ошибка');
    }
}

export function pickLettersFromTheWords(words: string[]): LevelData {

    let lettersVariants: string[] = [];

    for (let i = 0; i < words.length; i++) {

        const splitWord = words[i].split('');

        for (let j = 0; j < splitWord.length; j++) {
            const letter = splitWord[j];

            if(lettersVariants.indexOf(letter) === -1) lettersVariants.push(letter.toString());
        }

    }

    for (let i = 0; i < words.length; i++) {

        let splitWord = words[i].split('');

        let arr1 = [...splitWord];
        let arr2 = [...lettersVariants];

        let unpaired: string[] = [];

        for (let letter of arr1) {

            let index = arr2.indexOf(letter);

            if (index !== -1) {

                arr2.splice(index, 1);

            } else {

                unpaired.push(letter);

            }

        }

        for (let k = 0; k < unpaired.length; k++) {

            lettersVariants.push(unpaired[k]);

        }

    }

    lettersVariants = lettersVariants.map(letter => letter.toUpperCase());

    return {
        words: words,
        variants: lettersVariants,
    };
}