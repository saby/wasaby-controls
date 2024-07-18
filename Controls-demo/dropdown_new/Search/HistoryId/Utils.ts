import { dropdownHistoryUtils } from 'Controls/dropdown';
import {
    default as HistorySourceMenu,
    getItems,
} from 'Controls-demo/dropdown_new/Search/HistoryId/historySourceMenu';

let historySource;

function overrideOrigSourceMethod(): void {
    dropdownHistoryUtils.getSource = (source) => {
        if (!historySource) {
            historySource = new HistorySourceMenu({ source });
        }
        return Promise.resolve(historySource);
    };
}

function resetHistory() {
    historySource = undefined;
}

export { getItems, overrideOrigSourceMethod, resetHistory };
