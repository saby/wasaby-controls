import * as React from 'react';

import { CrudEntityKey } from 'Types/source';
import { relation } from 'Types/entity';
import { Logger } from 'UI/Utils';

import Fingers, { IProps as IFingersProps } from 'Controls/Fingers';
import { DataContext } from 'Controls-DataEnv/context';
import type { IListState, ListSlice } from 'Controls/dataFactory';
import { getParentActiveElement } from './_toc/getParentActiveElement';
import { getNodesFromRoot } from './_toc/getNodesFromRoot';

export interface IProps extends IFingersProps {
    root: CrudEntityKey;
    parentProperty: string;
    nodeProperty: string;
    storeId: string;
    level: number;
}

function getSelectedKey(
    props: IProps,
    slice: ListSlice & IListState,
    hierarchyRelation: relation.Hierarchy,
    initial?: boolean
): CrudEntityKey {
    let selectedKey: CrudEntityKey;
    const allowSelection = slice.viewMode !== 'search';
    if (allowSelection) {
        const configSelectedKey = slice.activeElement;
        selectedKey =
            configSelectedKey !== undefined
                ? configSelectedKey
                : props.selectedKey;
    }

    if (selectedKey !== undefined) {
        selectedKey = getParentActiveElement(
            { ...props, activeItemKey: selectedKey },
            hierarchyRelation
        );
    } else if (initial) {
        selectedKey = props.items.at(0)?.getKey();
    }

    return selectedKey;
}

function Toc(
    props: IProps,
    ref: React.ForwardedRef<object>
): React.ReactElement {
    const contextOptions = React.useContext(DataContext);
    const slice: ListSlice & IListState = contextOptions?.[props.storeId];
    const firstRenderRef = React.useRef(true);
    const properties = { ...slice.state, ...props };
    properties.selectedKey = props.selectedKey || slice.activeElement;
    properties.root = properties.root ?? null;
    const hierarchyRelation: relation.Hierarchy = new relation.Hierarchy({
        ...properties,
    });

    const selectedKey = getSelectedKey(
        properties,
        slice,
        hierarchyRelation,
        firstRenderRef.current
    );

    const onSelectedKeyChanged = function (key: CrudEntityKey): void {
        slice.setActiveElement(key);
        props.onSelectedKeyChanged?.(key);
    };

    const items = getNodesFromRoot(properties);

    if (props.storeId && slice['[ICompatibleSlice]']) {
        Logger.warn(
            'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration" +
                "/create-page/accordion/content/prefetch-config/'"
        );
    }

    if (slice.viewMode === 'search' && slice.activeElement) {
        slice.setActiveElement(null);
    }

    React.useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
        }
    });

    return (
        <Fingers
            forwardedRef={ref}
            alignment={properties.alignment}
            imageViewMode={properties.imageViewMode}
            imageProperty={properties.imageProperty}
            fallbackImage={properties.fallbackImage}
            selectedStyle={properties.selectedStyle}
            keyProperty={properties.keyProperty}
            displayProperty={properties.displayProperty}
            items={items}
            attrs={props.attrs}
            selectedKey={selectedKey}
            onSelectedKeyChanged={onSelectedKeyChanged}
        />
    );
}

export default React.forwardRef(Toc);

/**
 * Виджет для отображения списка в виде "пальцев".
 * Для отметки записей используется активный элемент из текущего контекста.
 * При изменении активного элемента будет обновлён и выделенный элемент списка в виде "пальцев".
 *
 * <pre class="brush: html">
 *      <Controls.browser:Browser
 *          source="{{ _source }}"
 *          root="{{ null }}"
 *          keyProperty="key"
 *          nodeProperty="type"
 *          parentProperty="parent"
 *          displayProperty="caption">
 *        <Controls-widgets.toc:View
 *              imageProperty="image"
 *              imageViewMode="rectangle"
 *              selectedStyle="{{ style }}"
 *              alignment="left"/>
 *      </Controls.browser:Browser>
 * </pre>
 *
 * @class Controls-ListEnv/_toc/Toc
 * @implements Controls/Fingers/IFingersProps
 * @demo Engine-demo/Controls-widgets/Toc/Base/Index
 * @public
 */

/**
 * @name Controls-ListEnv/_toc/Toc#root
 * @cfg {Types/source:CrudEntityKey} Ключ корневой записи, относительно которой будет отображен список.
 * @default null
 */

/**
 * @name Controls-ListEnv/_toc/Toc#parentProperty
 * @cfg {String} Имя поля записи, в котором хранится информация о родительском узле элемента.
 */

/**
 * @name Controls-ListEnv/_toc/Toc#nodeProperty
 * @cfg {String} Имя поля записи, в котором хранится информация о типе элемента (лист, узел, скрытый узел).
 */

/**
 * @name Controls-ListEnv/_toc/Toc#storeId
 * @cfg {number} Идентификуатор конфигурации в контексте.
 */

/**
 * @name Controls-ListEnv/_toc/Toc#level
 * @cfg {number} Уровень вложенности, по которому строится иерархия.
 */
