import * as React from 'react';
import { Selector } from 'Controls/multipleDropdown';
import { Memory } from 'Types/source';

const menuConfigs = {
    traffic: {
        source: new Memory({
            data: [
                {
                    id: 'traffic.1',
                    title: 'Городское',
                },
                {
                    id: 'traffic.2',
                    title: 'Пригородное',
                },
                {
                    id: 'traffic.3',
                    title: 'Междугородное',
                },
            ],
            keyProperty: 'id',
        }),
        keyProperty: 'id',
        displayProperty: 'title',
        menuHeadingCaption: 'вид сообщения',
        caption: 'Вид сообщения',
    },
    transportation: {
        source: new Memory({
            data: [
                {
                    key: 'transportation.1',
                    name: 'Перевозки для собственных нужд',
                },
                {
                    key: 'transportation.2',
                    name: 'Передвижение и работа специальных ТС',
                },
            ],
            keyProperty: 'key',
        }),
        keyProperty: 'key',
        displayProperty: 'name',
        menuHeadingCaption: 'вид перевозки',
        caption: 'вид перевозки',
    },
};

const INIT_SELECTED_KEYS = {
    traffic: ['traffic.2'],
    transportation: ['transportation.1'],
};

export default React.forwardRef(function DropdownDemo(props, ref) {
    const [selectedKeys, setSelectedKeys] = React.useState(INIT_SELECTED_KEYS);
    const selectedKeysChanged = React.useCallback(
        (newSelectedKeys) => {
            setSelectedKeys(newSelectedKeys);
        },
        [setSelectedKeys]
    );
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Selector
                    selectedKeys={selectedKeys}
                    onSelectedKeysChanged={selectedKeysChanged}
                    menuConfigs={menuConfigs}
                />
            </div>
        </div>
    );
});
