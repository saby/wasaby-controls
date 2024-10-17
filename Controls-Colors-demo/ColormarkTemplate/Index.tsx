import * as React from 'react';
import {Template} from 'Controls-Colors/colormarkTemplate';
import {itemsWithCustom, palette} from '../data';
import 'css!Controls-Colors-demo/Style';

export default React.forwardRef((_: {}, ref: React.LegacyRef<HTMLDivElement>): React.ReactElement => {
        const [selectedKeys, setSelectedKeys] = React.useState(['1']);

        const onSelectedKeysChanged = React.useCallback((keys) => {
            setSelectedKeys(() => keys);
        }, []);

        return (
            <div className="tw-flex tw-justify-center controls-padding_top-m controls-padding_bottom-m"
                 ref={ref}
            >
                <div className="Controls-Colors-demo_widthPanel">
                    <Template items={itemsWithCustom}
                              palette={palette}
                              selectedKeys={selectedKeys}
                              onSelectedKeysChanged={onSelectedKeysChanged}
                    />
                </div>
            </div>
        );
    });
