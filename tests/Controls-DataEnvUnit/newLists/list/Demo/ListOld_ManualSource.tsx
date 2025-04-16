import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import { personsData, KEY_PROPERTY } from './Data/personsData';
import ManualMemory from './Utils/ManualMemory';
import { View as ListComponent } from 'Controls/baseList';
import { ListOldWrapper, ListSliceOld } from './ListOldWrapper/ListOldWrapper';

export const LIST_QA = 'js-demo-list';
const DISPLAY_PROPERTY = 'name';

export default buildDemo({
    actions: [
        {
            name: 'Установить ручное управление загрузчиком',
            dataQa: 'source setManual true',
            action: ({ slice }) => {
                (slice.state.source as ManualMemory).setManual(true);
            },
        },
        {
            name: 'Вернуть данные от загрузчика',
            dataQa: 'source resolveQuery',
            action: ({ slice }) => {
                (slice.state.source as ManualMemory).resolveQuery();
            },
        },
        {
            name: 'Запустить загрузку по фильтру',
            dataQa: 'setFilter country=Norway',
            action: ({ slice }) => {
                slice.setFilter({
                    country: 'Norway',
                });
            },
        },
        {
            name: 'Отменить загрузку',
            dataQa: 'rejectSliceUpdate',
            action: ({ slice }) => {
                slice.rejectUpdate();
            },
        },
    ],
    Slice: class extends ListSliceOld {
        rejectUpdate() {
            this._rejectBeforeApplyPromise();
        }
        destroy() {
            (this.state.source as ManualMemory).setManual(false);
            super.destroy();
        }
    },
    Component: ({ storeId, slice }) => {
        // Оборачиваем временно в контейнер, т.к. наш контрол не умеет строитьс я вне скролла.
        return (
            <div data-qa={LIST_QA}>
                <ListOldWrapper slice={slice}>
                    <ListComponent storeId={storeId} />
                </ListOldWrapper>
            </div>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/ListOld_ManualSource',
    dataFactoryArguments: {
        source: new ManualMemory({
            keyProperty: KEY_PROPERTY,
            data: personsData.slice(0, 5),
        }),
        displayProperty: DISPLAY_PROPERTY,
        keyProperty: KEY_PROPERTY,
        searchParam: DISPLAY_PROPERTY,
    },
});
