import {Button} from 'Controls/dropdown';
import {
    companies,
    actions,
    actionsSmall,
    actionsSmallWithHierarchy,
} from 'Controls-demo/dropdown_new/Data';
import * as React from 'react';
import {RecordSet} from 'Types/collection';
import {Memory} from 'Types/source';
import {getItems} from 'Controls-demo/dropdown_new/Adaptive/historySourceMenu';
import {overrideOrigSourceMethod, resetHistory} from 'Controls-demo/dropdown_new/Adaptive/Utils';
import {Store} from 'Controls/HistoryStore';
import {Service, Source} from 'Controls/historyOld';

const HISTORY_ID = 'TEST_HISTORY_ID_dropdown_new';

const itemsScroll = new RecordSet({
    rawData: [...Array(50).keys()].map((index) => {
        return {
            key: index + 1,
            title: `Запись ${index + 1}`,
        };
    }),
    keyProperty: 'key',
});

const historySource = new Source({
    historySource: new Service({
        pinned: true,
        frequent: true,
        historyId: HISTORY_ID,
    }),
    originSource: new Memory({
        keyProperty: 'key',
        data: getItems(),
    }),
    parentProperty: 'parent',
    nodeProperty: '@parent',
});

overrideOrigSourceMethod();
export default React.forwardRef(function AdaptiveIndex(props, ref) {
    React.useEffect(() => {
        if (!Store.getLocal(HISTORY_ID).pinned?.getCount()) {
            [1, 2, 3].forEach((key) => {
                Store.togglePin(HISTORY_ID, key, true);
            });
        }
        return function resetHistoryMethod() {
            resetHistory();
        };
    }, []);

    return (
        <div
            className="controlsDemo__flexRow {{_options.theme.indexOf('default')<0 ? 'controlsDemo_fixedWidth500' : 'controlsDemo_fixedWidth300'}}">
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
                    historyId={HISTORY_ID}
                    parentProperty="parent"
                    nodeProperty="@parent"
                    class="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-history"
                ></Button>
            </div>
        </div>
    );
});
