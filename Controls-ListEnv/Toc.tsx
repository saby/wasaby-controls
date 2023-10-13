import * as React from 'react';

import { IObservable } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import { relation } from 'Types/entity';
import { Logger } from 'UI/Utils';

import Fingers, { IProps as IFingersProps } from 'Controls/Fingers';
import { useSlice } from 'Controls-DataEnv/context';
import type { ListSlice } from 'Controls/dataFactory';
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
    slice: ListSlice,
    hierarchyRelation: relation.Hierarchy
): CrudEntityKey {
    let selectedKey: CrudEntityKey;
    const allowSelection = slice.state.viewMode !== 'search';
    if (allowSelection) {
        const configSelectedKey = slice.state.activeElement;
        selectedKey = configSelectedKey !== undefined ? configSelectedKey : props.selectedKey;
    }

    if (selectedKey !== undefined) {
        selectedKey = getParentActiveElement(
            { ...props, activeItemKey: selectedKey },
            hierarchyRelation
        );
    }

    return selectedKey;
}

function Toc(props: IProps, ref: React.ForwardedRef<object>): React.ReactElement {
    const slice = useSlice<ListSlice>(props.storeId);
    const properties = { ...slice?.state, ...props };
    // root из props используется как fallback, правильно брать только из slice.
    const resolvedRoot = slice?.state.root !== undefined ? slice.state.root : props.root;
    properties.root = resolvedRoot !== undefined ? resolvedRoot : null;
    properties.selectedKey = props.selectedKey || slice?.state.activeElement;
    const hierarchyRelation: relation.Hierarchy = new relation.Hierarchy({
        ...properties,
    });

    const selectedKey = getSelectedKey(properties, slice, hierarchyRelation);

    const onSelectedKeyChanged = function (key: CrudEntityKey): void {
        slice.setActiveElement(key);
        props.onSelectedKeyChanged?.(key);
    };

    const [items, setItems] = React.useState(getNodesFromRoot(properties));

    // Обновляем подписку на изменение ОРИГИНАЛЬНОЙ коллекции.
    // Если внутри коллекции что-то поменялось, то
    // перерисовываем пальцы с обновлёнными записями.
    React.useEffect(() => {
        const handler = (_: unknown, action: string) => {
            if (
                action === IObservable.ACTION_RESET ||
                action === IObservable.ACTION_ADD ||
                action === IObservable.ACTION_REMOVE ||
                action === IObservable.ACTION_MOVE ||
                action === IObservable.ACTION_CHANGE
            ) {
                setItems(getNodesFromRoot(properties));
            }
        };

        properties.items.subscribe('onCollectionChange', handler);
        return () => {
            properties.items.unsubscribe('onCollectionChange', handler);
        };
    }, [properties.items]);

    // Перерисовываем пальцы с новыми записями,
    // если в пропсы пришли новые параметры.
    React.useEffect(() => {
        setItems(getNodesFromRoot(properties));
    }, [properties.items, properties.parentProperty, properties.nodeProperty, properties.root]);

    if (props.storeId && slice['[ICompatibleSlice]']) {
        Logger.warn(
            'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration" +
                "/create-page/accordion/content/prefetch-config/'"
        );
    }

    if (slice.state.viewMode === 'search' && slice.state.activeElement) {
        slice.setActiveElement(null);
    }

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
 * @demo Controls-ListEnv-demo/Toc/MasterDetail/Index
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
