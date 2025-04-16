import type { Debugger } from './Debugger';
import * as ErrorDescriptors from './ErrorDescriptors';

/**
 * Хранилище всех активных отладчиков.
 */
export default class DebuggersStorage {
    private _debuggers: Map<string, Debugger> = new Map();

    getAll() {
        return this._debuggers;
    }

    renderNew(name?: string) {
        if (name) {
            this._debuggers.get(name)?.getOutput().renderNew();
        } else {
            this._debuggers.forEach((inst) => inst.getOutput().renderNew());
        }
    }

    /**
     * @return id отладчика в хранилище отладчиков.
     */
    register(inst: Debugger, instName: string): string {
        const name = instName;
        if (this._debuggers.has(name)) {
            // Мы не должны модифицировать имя отладчика, оно должно совпадать с именем слайса, которое уникально.
            // throw ErrorDescriptors.DEBUGGER_EXISTS_IN_STORAGE(name);
            return this.register(inst, name + '_');
        }
        this._debuggers.set(name, inst);
        return name;
    }

    unregister(inst: Debugger) {
        const name = inst.getName();
        if (!this._debuggers.has(name)) {
            throw ErrorDescriptors.DEBUGGER_MISSING_IN_STORAGE(name);
        }
        this._debuggers.delete(name);
    }

    private static instance: DebuggersStorage;

    static getInstance() {
        if (!DebuggersStorage.instance) {
            DebuggersStorage.instance = new DebuggersStorage();
        }
        return DebuggersStorage.instance;
    }
}
