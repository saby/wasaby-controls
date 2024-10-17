import { ListSlice } from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';

interface IRemoveOptions {
    context: Record<string, ListSlice>;
}

export default class RemoveViewCommand {
    protected _options: IRemoveOptions;

    constructor(options: IRemoveOptions) {
        this._options = options;
    }

    execute(config): Promise<RecordSet> {
        const executePromise = this._options.command
            ? this._options.command.execute(config)
            : Promise.resolve();
        return executePromise.then(() => {
            const slice = this._options.context.nomenclature;
            slice.setSelectedKeys([]);
            return slice.reload();
        });
    }
}
