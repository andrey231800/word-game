
interface WordsObject {
    words: string[];
}

export async function getLevelFromJSON(level: number = 1) {

    const url = `assets/levels/${level}.json`;

    try {
        const response = await fetch(url);

        const data: WordsObject = await response.json();

        return data;

    } catch (error) {
        throw error instanceof Error ? error : new Error('Неизвестная ошибка');
    }
}