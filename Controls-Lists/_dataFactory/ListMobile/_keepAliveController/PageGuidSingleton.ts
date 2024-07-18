import { Guid } from 'Types/entity';

export default class PageGuidSingleton {
    private static instance?: PageGuidSingleton;

    private _guid?: string;

    private constructor() {}
    public static getInstance() {
        if (!PageGuidSingleton.instance) {
            PageGuidSingleton.instance = new PageGuidSingleton();
        }
        return PageGuidSingleton.instance;
    }

    getGUID() {
        return this._getGuid();
    }

    refreshGUID() {
        this._guid = undefined;
    }

    private _getGuid(): string {
        if (!this._guid) {
            this._guid = Guid.create();
        }

        return this._guid;
    }
}
