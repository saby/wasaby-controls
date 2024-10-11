import { GroupTemplate as GridGroupTemplate } from 'Controls/grid';
import { GroupItem } from 'Controls/display';
import { loadSync } from 'WasabyLoader/ModulesLoader';

/**
 * Шаблон, который по умолчанию используется для отображения заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы} в меню.
 *
 * @class Controls/menu:GroupTemplate
 * @example
 * @example
 * <pre class="brush: html">
 * <Controls.menu:Control
 *    keyProperty="key"
 *    source="{{_source}}"
 *    groupProperty="group">
 *    <ws:groupTemplate>
 *      <ws:partial template="Controls/menu:GroupTemplate" showText="{{true}}"/>
 *    </ws:groupTemplate>
 *    </Controls.dropdown:Button>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/item-config/group/ здесь}.
 * @public
 */

export default function GroupTemplate(props): JSX.Element {
    if (props.isHistoryGroup) {
        return (
            <div
                className={`${props.className} tw-flex tw-items-center tw-w-full controls-inlineheight-s controls-padding_top-xs controls-padding_bottom-3xs`}
            >
                <div className="controls-Menu-historySeparator tw-w-full controls-padding_left-l controls-padding_right-l">
                    <div className="controls-Menu__group_separator"></div>
                </div>
            </div>
        );
    } else {
        const isGroup = isGroupVisible(props.item, props.emptyItem);
        if (isGroup) {
            const customTemplate = props.customGroupTemplate;
            if (customTemplate) {
                let CustomGroupTemplate = customTemplate;
                if (customTemplate.charAt) {
                    CustomGroupTemplate = loadSync(customTemplate);
                }
                return (
                    <CustomGroupTemplate
                        className={props.className}
                        attrs={props.attrs}
                        item={props.item}
                        itemData={props.itemData}
                    />
                );
            }
            return (
                <GridGroupTemplate
                    {...props}
                    separatorVisibility={props.separatorVisibility}
                    expanderVisible={false}
                    textAlign={props.textAlign}
                    textVisible={props.showText === true}
                    paddingTop="xs"
                    paddingBottom="3xs"
                    className={`${
                        !props.item.isFirstItem() ? 'controls-Menu__group_marginTop' : ''
                    } controls-Menu__group_marginBottom ${
                        props.separatorVisibility !== false && props.textAlign !== 'left'
                            ? 'controls-Menu__group_withSeparator'
                            : 'controls-Menu__group_withoutSeparator'
                    } `}
                />
            );
        } else {
            return <div className="controls-ListView__itemV controls-ListView__groupHidden"></div>;
        }
    }
}

export function isGroupVisible(groupItem: GroupItem, emptyItem): boolean {
    const collection = groupItem.getOwner();
    const itemsGroupCount = collection.getGroupItems(groupItem.getContents()).length;
    const collectionCount = collection.getCount(true) + (emptyItem ? 1 : 0);
    return !groupItem.isHiddenGroup() && itemsGroupCount > 0 && itemsGroupCount !== collectionCount;
}

/**
 * @name Controls/menu:GroupTemplate#showText
 * @cfg {Boolean} Определяет, отображается ли название группы.
 * @default false
 */

/**
 * @name Controls/menu:GroupTemplate#separatorVisibility
 * @cfg {Boolean} Определяет видимость горизонтальной линии.
 * @default true
 */

/**
 * @name Controls/menu:GroupTemplate#textAlign
 * @cfg {String} Выравнивание заголовка группы по горизонтали.
 * @variant left Текст выравнивается по левой стороне.
 * @variant right Текст выравнивается по правой стороне.
 * @default undefined
 */

/**
 * @name Controls/menu:GroupTemplate#contentTemplate
 * @cfg {String|TemplateFunction|undefined} Устанавливает пользовательский шаблон, описывающий содержимое элемента.
 * @default undefined
 */
