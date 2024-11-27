import { Panel } from 'Controls-Colors/colormark';
import { Sticky } from 'Controls/popupTemplate';
import { Model } from 'Types/entity';
import 'css!Controls-Colors-demo/Style';
import * as React from 'react';
import { items as initItems, palette } from '../data';

export default React.forwardRef(
    (props, ref: React.LegacyRef<HTMLDivElement>): React.ReactElement => {
        const [selectedKeys, setSelectedKeys] = React.useState(['1']);
        const onSelectedKeysChanged = React.useCallback((keys) => {
            setSelectedKeys(() => keys);
        }, []);

        const [items, setItems] = React.useState(initItems);

        const onBeforeEndEdit = (item: Model) => {
            const itemData = item.getRawData();
            const newItems = items.map((i) => (i.id === itemData.id ? itemData : i));
            setItems(newItems);
            return itemData;
        };

        return (
            <div
                className="tw-flex tw-justify-center controls-padding_top-m controls-padding_bottom-m"
                ref={ref}
            >
                <div className="Controls-Colors-demo_widthPanel">
                    <Sticky
                        borderVisible={true}
                        closeButtonVisible={false}
                        bodyContentTemplate={() => {
                            return (
                                <Panel
                                    items={items}
                                    palette={palette}
                                    selectedKeys={selectedKeys}
                                    onSelectedKeysChanged={onSelectedKeysChanged}
                                    onBeforeEndEdit={onBeforeEndEdit}
                                    addedItemType="style"
                                />
                            );
                        }}
                    />
                </div>
            </div>
        );
    }
);
