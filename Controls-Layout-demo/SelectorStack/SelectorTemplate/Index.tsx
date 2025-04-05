import { getArguments } from './ConfigLoader';
import { DoubleSwitch, Switch } from 'Controls/toggle';
import { Selector } from 'Controls/lookup';
import { useCallback, ForwardedRef, forwardRef, useState, ReactElement } from 'react';
import { IControlProps } from 'Controls/interface';
import 'css!Controls-Layout-demo/SelectorStack/SelectorTemplate/Index';

export interface IGetConfigProps {
    tabs?: boolean;
    multiSelect?: boolean;
    hierarchy?: boolean;
    filter?: boolean;
    longFiler?: boolean;
    addButton?: boolean;
    toolbar?: boolean;
    history?: boolean;
    initialKey?: string;
    appliedFilter?: boolean;
    caption?: string;
}

function SelectorDemo(props: IControlProps, ref: ForwardedRef<HTMLDivElement>): ReactElement {
    const [selectorConfig, setSelectorConfig] = useState({
        tabs: false,
        multiSelect: false,
        hierarchy: false,
        filter: true,
        addButton: false,
        toolbar: true,
    });
    const selectorTemplate = {
        templateName: 'Controls-Layout/selectorStack:Stack',
        templateOptions: getArguments(selectorConfig),
        popupOptions: {
            width: 500,
        },
    };

    const className = `${props.className} tw-flex`;
    return (
        <div className={className} ref={ref}>
            <Selector selectorTemplate={selectorTemplate} caption={'Choose'} multiSelect={true} />
            <div className="Controls-Layout-demo_selector_props_container">
                <div className="Controls-Layout-demo_selector_props">
                    <DoubleSwitch
                        orientation="horizontal"
                        onCaption="С вкладками"
                        offCaption="Без вкладок"
                        value={selectorConfig.tabs}
                        onValueChanged={useCallback(
                            (value) => {
                                setSelectorConfig({ ...selectorConfig, tabs: value });
                            },
                            [selectorConfig]
                        )}
                    />
                    <DoubleSwitch
                        orientation="horizontal"
                        onCaption="Множественный выбор"
                        offCaption="Единичный"
                        value={selectorConfig.multiSelect}
                        onValueChanged={useCallback(
                            (value) => {
                                setSelectorConfig({ ...selectorConfig, multiSelect: value });
                            },
                            [selectorConfig]
                        )}
                    />
                    <DoubleSwitch
                        orientation="horizontal"
                        onCaption="Иерархический список"
                        offCaption="Плоский"
                        value={selectorConfig.hierarchy}
                        onValueChanged={useCallback(
                            (value) => {
                                setSelectorConfig({ ...selectorConfig, hierarchy: value });
                            },
                            [selectorConfig]
                        )}
                    />
                    <Switch
                        caption="Фильтр"
                        value={selectorConfig.filter}
                        onValueChanged={useCallback(
                            (value) => {
                                setSelectorConfig({ ...selectorConfig, filter: value });
                            },
                            [selectorConfig]
                        )}
                    />
                    <Switch
                        caption="Кнопка +"
                        value={selectorConfig.addButton}
                        onValueChanged={useCallback(
                            (value) => {
                                setSelectorConfig({ ...selectorConfig, addButton: value });
                            },
                            [selectorConfig]
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

const forwardedSelectorDemo = forwardRef(SelectorDemo);
export default forwardedSelectorDemo;
