import { TwoTabs } from '../game/TwoTabs';
import { App } from './App';
import { IApp } from '../types/IApp';

export class LocalStorageManager {

    storageKey: string;
    twoTabs!: TwoTabs;

    constructor() {

        this.storageKey = 'page-opened';

        this.setEvents();
        this.setPageOpenStatus(true);

        // if(this.checkPageOpenStatus()) {
        //     console.log(GAME_STATE);
        //     console.log('Страница уже открыта в другой вкладке!');
        // }
    }

    //here a basic logic for tracking two simultaneously opened tabs and saving
    // the status of the game in localstorage
    // that is, once the page is refreshed, progress should not be reset

    private setEvents() {
        window.addEventListener('beforeunload', () => {
            console.log('unload');

            localStorage.setItem('gameState', JSON.stringify(App.State));

            this.setPageOpenStatus(false);

        });

        window.addEventListener('load', () => {

            this.setGameState();
        });

        window.addEventListener('storage', (event) => {

            if(event.newValue) {

                if (event.key === this.storageKey) {
                    const pageStatus = JSON.parse(event.newValue);
                    if (pageStatus.status) {
                        console.log('Страница открыта в другой вкладке!');

                        localStorage.setItem('gameState', JSON.stringify(App.State));

                        if(this.twoTabs instanceof TwoTabs) {

                            this.twoTabs.show();
                        }
                    }
                }
            }

        });
    }

    private setGameState() {
        const savedState = localStorage.getItem('gameState');

        if(savedState) {
            const data = JSON.parse(savedState);

            App.State.level = data.level;
            App.State.words = data.words;

        }

        App.CURRENT_LEVEL = App.State.level;
    }

    public setPageOpenStatus(status: boolean) {
        localStorage.setItem(this.storageKey, JSON.stringify({
            status: status,
            timestamp: new Date().getTime(),
        }));
    }

    private checkPageOpenStatus() {
        const item = localStorage.getItem(this.storageKey);

        if(item) {
            const pageStatus = JSON.parse(item);
            return pageStatus && pageStatus.status;
        }
    }
}