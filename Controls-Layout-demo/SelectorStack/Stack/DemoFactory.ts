import {
    ISelectFactoryLoadResults,
    SelectSlice,
    loadData,
    ISelectFactoryArguments,
} from 'Controls/selector';

class DemoSlice extends SelectSlice {
    protected _initState(loadResults: ISelectFactoryLoadResults, config: ISelectFactoryArguments) {
        return {
            ...super._initState(loadResults, config),
            isSelectionChanged: true,
        };
    }
}

export default { loadData, slice: DemoSlice };
