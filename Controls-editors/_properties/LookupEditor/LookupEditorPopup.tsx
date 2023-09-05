import * as rk from 'i18n!Controls-editors';
import { memo } from 'react';
import { Model } from 'Types/entity';
import { Stack } from 'Controls/popupTemplate';
import { DataContext } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { DataMapTree } from './DataMapTree';

interface ILookupEditorPopup {
    sendResultCallback: Function;
    dataContext: Record<string, Slice<unknown>>;
    handlers?: {
        onSelectComplete: Function;
    };
}

const STORE_ID = 'dataMapPage';
const CUSTOM_EVENTS = ['onItemClick'];

const LookupEditorPopup = memo((props: ILookupEditorPopup) => {
    const { sendResultCallback, dataContext } = props;

    const onItemClick = (item: Model, event, result) => {
        if (item.get('View') !== 'value') {
            return;
        }

        sendResultCallback({
            id: item.get('Id'),
            title: item.get('Title'),
            parent: item.get('Parent'),
        });
        props.handlers.onSelectComplete(event, result);
    };

    return (
        <DataContext.Provider value={dataContext}>
            <Stack
                storeId={STORE_ID}
                closeButtonVisibility={true}
                onItemClick={onItemClick}
                customEvents={CUSTOM_EVENTS}
                closeButtonViewMode="toolButton"
                headerBorderVisible={true}
                rightBorderVisible={true}
                backgroundStyle="unaccented"
                headingCaption={rk('Данные')}
                bodyContentTemplate={DataMapTree}
            />
        </DataContext.Provider>
    );
});

LookupEditorPopup.isReact = true;
export default LookupEditorPopup;
