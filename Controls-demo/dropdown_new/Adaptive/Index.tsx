import { Button } from 'Controls/dropdown';
import {
    companies,
    actions,
    actionsSmall,
    actionsSmallWithHierarchy,
} from 'Controls-demo/dropdown_new/Data';
import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { getItems } from 'Controls-demo/dropdown_new/Adaptive/historySourceMenu';
import { overrideOrigSourceMethod, resetHistory } from 'Controls-demo/dropdown_new/Adaptive/Utils';

const itemsScroll = new RecordSet({
    rawData: [...Array(50).keys()].map((index) => {
        return {
            key: index + 1,
            title: `Запись ${index + 1}`,
        };
    }),
    keyProperty: 'key',
});

const historySource = new Memory({
    keyProperty: 'key',
    data: getItems(),
});
overrideOrigSourceMethod();
export default React.forwardRef(function AdaptiveIndex(props, ref) {
    React.useEffect(() => {
        return function resetHistoryMethod() {
            resetHistory();
        };
    });

    return (
        <div className="controlsDemo__flexRow {{_options.theme.indexOf('default')<0 ? 'controlsDemo_fixedWidth500' : 'controlsDemo_fixedWidth300'}}">
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">Меню открывается в окне</div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    icon="icon-SettingsNew"
                    items={actionsSmall}
                    className="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-simple"
                    menuHeadingCaption="Доп. операции"
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">
                    Маленькое меню с иерархией открывается в шторке
                </div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    icon="icon-SettingsNew"
                    items={actionsSmallWithHierarchy}
                    parentProperty="parent"
                    nodeProperty="node"
                    className="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-hierarchy"
                    menuHeadingCaption="Доп. операции"
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">Меню с иерархией открывается в шторке</div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    icon="icon-SettingsNew"
                    items={actions}
                    parentProperty="parent"
                    nodeProperty="node"
                    className="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-hierarchy-manyItems"
                    menuHeadingCaption="Доп. операции"
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">
                    Меню с большим количеством пунктов открывается в шторке
                </div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    caption="Компания"
                    items={companies}
                    class="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-manyItems"
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">Меню со скроллом открывается в шторке</div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    caption="Компания"
                    items={itemsScroll}
                    class="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-scroll"
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">Меню с историей открывается в шторке</div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    keyProperty="key"
                    caption="Компания"
                    source={historySource}
                    historyId="demo_history_id"
                    parentProperty="parent"
                    nodeProperty="@parent"
                    class="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-history"
                ></Button>
            </div>
        </div>
    );
});
