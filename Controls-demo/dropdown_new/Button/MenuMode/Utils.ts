import { dropdownHistoryUtils } from 'Controls/dropdown';
import { default as HistorySourceMenu } from 'Controls-demo/dropdown_new/Button/MenuMode/historySourceMenu';

let historySources = {};

function overrideOrigSourceMethod(): void {
    dropdownHistoryUtils.getSource = (source, options) => {
        if (!historySources[options.historyId]) {
            historySources[options.historyId] = new HistorySourceMenu({});
        }
        return Promise.resolve(historySources[options.historyId]);
    };
}

function resetHistory() {
    historySources = {};
}

export { overrideOrigSourceMethod, resetHistory };
