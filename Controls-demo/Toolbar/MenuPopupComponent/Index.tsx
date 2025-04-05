import * as React from 'react';
import { showType, View } from 'Controls/toolbars';
import { RecordSet } from 'Types/collection';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';

const menuSource = new ExplorerMemory({
    data: [
        {
            key: 'business',
            title: 'Бизнес',
            parent: null,
            node: false,
        },
        {
            key: 'money',
            title: 'Деньги',
            parent: null,
            node: false,
        },
        {
            key: 'purchases',
            title: 'Закупки и расходы',
            parent: 'business',
            node: false,
        },
        {
            key: 'crm',
            title: 'Продажи и CRM',
            parent: 'business',
            node: null,
        },
        {
            key: 'visitors',
            title: 'Посетители сайта',
            parent: null,
            node: true,
            type: 'regl',
            expanderIcon: 'hidden',
        },
        {
            key: 'cash',
            title: 'Касса',
            parent: 'money',
            node: false,
        },
        {
            key: 'payment',
            title: 'Заявки на оплату',
            parent: 'money',
            node: null,
        },
        {
            key: 'returns',
            title: 'Возвраты',
            parent: 'purchases',
            node: true,
            type: 'regl',
            expanderIcon: 'hidden',
        },
        {
            key: 'orders',
            title: 'Заказы',
            parent: 'purchases',
            node: true,
            type: 'regl',
            expanderIcon: 'hidden',
        },
        {
            key: 'accounts',
            title: 'Счета',
            parent: 'purchases',
            node: true,
            type: 'regl',
            expanderIcon: 'hidden',
        },
        {
            key: 'forAll',
            title: 'Для всех документов',
            parent: 'returns',
            node: null,
        },
        {
            key: 'addFields',
            title: 'Доп поля',
            parent: 'returns',
            node: true,
            expanderIcon: 'hidden',
            type: 'event',
        },
        {
            key: 'forAll',
            title: 'Для всех документов',
            parent: 'orders',
            node: null,
        },
        {
            key: 'supplier',
            title: 'Заказ поставщику',
            parent: 'orders',
            node: null,
        },
        {
            key: 'template',
            title: 'Шаблон',
            parent: 'accounts',
            node: null,
        },
        {
            key: 'archive',
            title: 'Диадок архив',
            parent: 'accounts',
            node: null,
        },
        {
            key: 'basket',
            title: 'Корзина',
            parent: 'accounts',
            node: null,
        },
        {
            key: 'first',
            title: 'Первый заход на сайт',
            parent: 'visitors',
            node: null,
        },
        {
            key: 'ads',
            title: 'Переход с рекламы',
            parent: 'visitors',
            node: null,
        },
        {
            key: 'every',
            title: 'Каждый заход на сайт',
            parent: 'visitors',
            node: null,
        },
        {
            key: 'receipt',
            title: 'Приходный кассовый ордер',
            parent: 'cash',
            node: null,
        },
        {
            key: 'expense',
            title: 'Расходный кассовый ордер',
            parent: 'cash',
            node: null,
        },
        {
            key: 'create',
            title: 'Создание',
            parent: 'addFields',
            node: null,
        },
        {
            key: 'change',
            title: 'Изменение',
            parent: 'addFields',
            node: null,
        },
    ],
    keyProperty: 'key',
});

function Counter(_, ref) {
    const items = new RecordSet({
        keyProperty: 'key',
        rawData: [
            {
                key: '1',
                showType: showType.TOOLBAR,
                title: 'Открыть menuPopupComponent',
                node: true,
                icon: 'icon-DownloadNew',
                reloadOnOpen: true,
                menuOptions: {
                    menuPopupComponent: 'Controls-Layout/selectorSticky:Template',
                    breadCrumbsVisibility: 'visible',
                    searchParam: 'title',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    headingCaption: 'Заголовок',
                    source: menuSource,
                    viewMode: 'table',
                    root: null,
                },
            },
        ],
    });

    return (
        <div ref={ref} className="controls-margin_left-l">
            <div style={{ marginLeft: '75px' }}>
                <View
                    data-qa="Controls-demo_Toolbar_Counter__vertical"
                    direction="vertical"
                    items={items}
                    menuSource={menuSource}
                    nodeProperty="node"
                    inlineHeight="l"
                    keyProperty="key"
                />
            </div>
        </div>
    );
}

export default React.forwardRef(Counter);
