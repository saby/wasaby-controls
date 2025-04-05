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
import { getItemsDoNotSaveToHistory } from 'Controls-demo/dropdown_new/resources/Data';
import { Store } from 'Controls/HistoryStore';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';

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

const historySource = new ExplorerMemory({
    data: getItemsDoNotSaveToHistory(),
    keyProperty: 'key',
    filter: () => true,
});

const actionsSource = new Memory({
    data: actions.getRawData(),
    keyProperty: 'key',
    filter: () => true,
});

const actionsSmallWithHierarchySource = new Memory({
    data: actionsSmallWithHierarchy.getRawData(),
    keyProperty: 'key',
    filter: () => true,
});

export default React.forwardRef(function AdaptiveIndex(props, ref) {
    React.useEffect(() => {
        if (!Store.getLocal(HISTORY_ID).pinned?.getCount()) {
            [1, 2, 3].forEach((key) => {
                Store.togglePin(HISTORY_ID, key, true);
            });
        }
    }, []);

    const menuItemActivate = React.useCallback((item) => {
        return item.get('node') === null;
    }, []);

    return (
        <div className="controlsDemo__flexRow {{_options.theme.indexOf('default')<0 ? 'controlsDemo_fixedWidth500' : 'controlsDemo_fixedWidth300'}}">
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">Меню открывается в окне</div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    menuPopupComponent="Controls/selectorSticky:Template"
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
                    menuPopupComponent="Controls/selectorSticky:Template"
                    keyProperty="key"
                    icon="icon-SettingsNew"
                    source={actionsSmallWithHierarchySource}
                    parentProperty="parent"
                    nodeProperty="node"
                    displayProperty="title"
                    className="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-hierarchy"
                    menuHeadingCaption="Доп. операции"
                    onMenuItemActivate={menuItemActivate}
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">Меню с иерархией открывается в шторке</div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    menuPopupComponent="Controls/selectorSticky:Template"
                    keyProperty="key"
                    icon="icon-SettingsNew"
                    source={actionsSource}
                    parentProperty="parent"
                    nodeProperty="node"
                    displayProperty="title"
                    className="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-hierarchy-manyItems"
                    menuHeadingCaption="Доп. операции"
                    onMenuItemActivate={menuItemActivate}
                ></Button>
            </div>
            <div className="controlsDemo__wrapper">
                <div className="controls-text-label">
                    Меню с большим количеством пунктов открывается в шторке
                </div>
                <Button
                    ref={ref}
                    isAdaptive={props.isAdaptive}
                    menuPopupComponent="Controls/selectorSticky:Template"
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
                    menuPopupComponent="Controls/selectorSticky:Template"
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
                    menuPopupComponent="Controls/selectorSticky:Template"
                    keyProperty="key"
                    caption="Компания"
                    source={historySource}
                    historyId={HISTORY_ID}
                    parentProperty="parent"
                    nodeProperty="@parent"
                    displayProperty="title"
                    class="controlsDemo-menuButton"
                    data-qa="ControlsDemo_MenuButton__adaptive-history"
                    onMenuItemActivate={menuItemActivate}
                ></Button>
            </div>
        </div>
    );
});
