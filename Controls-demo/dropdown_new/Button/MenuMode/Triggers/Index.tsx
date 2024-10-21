import * as React from 'react';
import { Button } from 'Controls/dropdown';
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

export default React.forwardRef(function DropdownDemo(props, ref) {
    const menuItemActivate = React.useCallback((item) => {
        // Не закрывать меню для скрытых узлов
        return item.get('node');
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    openedSubMenuKey="purchases"
                    keyProperty="key"
                    menuViewMode="table"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    searchParam="title"
                    menuHeadingCaption="Выберите объект"
                    menuMode="selector"
                    caption="Создать"
                    menuBreadCrumbsVisibility={'visible'}
                    headerContentTemplate="Controls-demo/dropdown_new/Button/MenuMode/Triggers/HeaderContentTemplate"
                    onMenuItemActivate={menuItemActivate}
                />
            </div>
        </div>
    );
});
