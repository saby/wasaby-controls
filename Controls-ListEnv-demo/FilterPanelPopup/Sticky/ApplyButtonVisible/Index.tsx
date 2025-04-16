import { Sticky } from 'Controls/filterPanelPopup';
import {
    dropdownMultiSelectConfig,
    multiSelectLookupConfig,
    textConfig,
} from 'Controls-ListEnv-demo/FilterPanelPopup/Sticky/resources/Data';

const items = [textConfig, dropdownMultiSelectConfig, multiSelectLookupConfig];

export default function ApplyButtonVisible() {
    return (
        <div className="controlsDemo__wrapper">
            <Sticky
                applyButtonVisible={false}
                orientation="horizontal"
                items={items}
                historyId="FILTER_HISTORY_EMPTY"
            />
        </div>
    );
}
