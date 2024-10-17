import { Store } from 'Controls/HistoryStore';
import { LocalStorage } from 'BrowserAPI/Storage';

const historyItem = {
    value: true,
    resetValue: false,
    viewMode: 'basic',
    editorTemplateName: 'Controls/filterPanelEditors:Boolean',
    editorOptions: {
        extendedCaption: 'extendedFilterCaption',
        value: true,
    },
};

function clearHistory(): void {
    const localStorage = new LocalStorage();
    localStorage.clear();
}

export async function initHistory(
    historyId: string,
    count: number = 1,
    filterName: string = 'historyItem',
    pinCount?: number
) {
    clearHistory();
    for (let i = 0; i < count; i++) {
        const key = await Store.push(historyId, [
            {
                ...historyItem,
                name: `${filterName}-${i}`,
                textValue: `textValue-${i}`,
            },
        ]);
        if (pinCount && pinCount > i) {
            await Store.togglePin(historyId, key);
        }
    }
}
