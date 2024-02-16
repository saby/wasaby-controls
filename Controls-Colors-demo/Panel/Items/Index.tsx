import * as React from 'react';
import {Panel} from 'Controls-Colors/colormark';
import {itemsWithCustom, palette} from '../../data';
import {Sticky} from 'Controls/popupTemplate';
import 'css!Controls-Colors-demo/Style';

export default React.forwardRef(
    (props, ref: React.LegacyRef<HTMLDivElement>): React.ReactElement => {
        const [selectedKeys, setSelectedKeys] = React.useState(['1']);
        const onSelectedKeysChanged = React.useCallback((keys) => {
            setSelectedKeys(() => keys);
        }, []);
        return (
            <div ref={ref}
                 className="tw-flex tw-justify-center controls-padding_top-m controls-padding_bottom-m"
            >
                <div className="Controls-Colors-demo_widthPanel_m">
                    <Sticky borderVisible={true}
                            closeButtonVisible={false}
                            bodyContentTemplate={() => {
                                return (
                                    <Panel items={itemsWithCustom}
                                           palette={palette}
                                           selectedKeys={selectedKeys}
                                           onSelectedKeysChanged={onSelectedKeysChanged}
                                    />
                                );
                            }
                            }/>
                </div>
            </div>
        );
    });
