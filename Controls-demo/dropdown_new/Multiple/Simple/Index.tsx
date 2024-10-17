import * as React from 'react';
import { Selector } from 'Controls/multipleDropdown';
import { RecordSet } from 'Types/collection';

const menuConfigs = {
    traffic: {
        items: new RecordSet({
            rawData: [
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
        items: new RecordSet({
            rawData: [
                {
                    key: 'transportation.1',
                    name: 'Перевозки для собственных нужд',
                },
                {
                    key: 'transportation.2',
                    name: 'Передвижение и работа специальных ТС',
                    node: false,
                },
                {
                    key: 'transportation.21',
                    name: 'Спец ТС 1',
                    parent: 'transportation.2',
                },
                {
                    key: 'transportation.22',
                    name: 'Спец ТС 2',
                    parent: 'transportation.2',
                },
            ],
            keyProperty: 'key',
        }),
        nodeProperty: 'node',
        parentProperty: 'parent',
        keyProperty: 'key',
        displayProperty: 'name',
        menuHeadingCaption: 'вид перевозки',
        caption: 'вид перевозки',
    },
};

export default React.forwardRef(function DropdownDemo(props, ref) {
    const [selectedKeys, setSelectedKeys] = React.useState();
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
