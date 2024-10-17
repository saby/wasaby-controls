import * as React from 'react';
import { Button, ItemTemplate } from 'Controls/dropdown';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';

const source = new ExplorerMemory({
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
            expanderIcon: 'hidden',
        },
        {
            key: 'orders',
            title: 'Заказы',
            parent: 'purchases',
            node: true,
            expanderIcon: 'hidden',
        },
        {
            key: 'accounts',
            title: 'Счета',
            parent: 'purchases',
            node: true,
            expanderIcon: 'none',
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
            node: null,
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
    ],
    keyProperty: 'key',
});

export default React.forwardRef(function DropdownDemo(props, ref) {
    const menuItemActivate = React.useCallback((item) => {
        // Не закрывать меню для скрытых узлов
        return item.get('node');
    }, []);

    const dataLoadCallback = React.useCallback((items) => {
        // Для демо-примера, чтобы по хлебной крошке возвращаться сразу в корень
        if (items.getMetaData()?.path?.getCount()) {
            items.getMetaData().path.at(0).set('parent', null);
        }
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    openedSubMenuKey="purchases"
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    searchParam="title"
                    menuHeadingCaption="Создать триггер"
                    menuMode="selector"
                    caption="Создать"
                    onMenuItemActivate={menuItemActivate}
                    itemTemplate={CustomItemTemplate}
                    dataLoadCallback={dataLoadCallback}
                />
            </div>
        </div>
    );
});

function CustomItemTemplate(props): React.ReactElement {
    return <ItemTemplate {...props} contentTemplate={ContentTemplate} />;
}

function ContentTemplate(props): React.ReactElement {
    const isNode = props.item.contents.get('node');
    return (
        <div>
            {props.item.contents.get('title') +
                (isNode ? ' (узел)' : isNode === false ? ' (скрытый узел)' : '')}
        </div>
    );
}
