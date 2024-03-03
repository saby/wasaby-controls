import { ArrayType, ObjectType, StringType } from 'Meta/types';
import { IItemsOptions } from 'Controls-Containers/interface';
import * as rk from 'i18n!Controls-Containers';

const items = [{ id: 1, title: rk('Первая вкладка'), align: 'left', parent: null, node: false }];

// Для приведения к корректному виду, чтобы вкладки по умолчанию выравнивались по левому краю
function getCorrectValue(data: Record<string, unknown>) {
    if (data) {
        data.align = 'left';
    }
    return data;
}

export const TTabsVariantsType = ObjectType.id('Controls-Containers/interface:TTabsVariantsType')
    .attributes<IItemsOptions>({
        variants: ObjectType.title(null)
            .order(1)
            .editor(
                () => {
                    return import('Controls-editors/properties').then(({ TreeEditor }) => {
                        return TreeEditor;
                    });
                },
                {
                    markerVisibility: 'visible',
                    expanderVisibility: 'hasChildren',
                    allowHierarchy: false,
                    selectable: true,
                    footerCaption: rk('Вкладка'),
                    getCorrectValue,
                    items,
                }
            )
            .attributes({
                items: ArrayType.of(ObjectType),
                selectedKeys: ArrayType.of(StringType),
            }),
    })
    .optional()
    .defaultValue({});