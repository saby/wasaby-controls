import * as React from 'react';
import {ColormarkTemplate} from 'Controls-Colors/dialogTemplate';
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
                    <ColormarkTemplate items={itemsWithCustom}
                                       palette={palette}
                                       selectedKeys={selectedKeys}
                                       onSelectedKeysChanged={onSelectedKeysChanged}
                    />
                </div>
            </div>
        );
    });
