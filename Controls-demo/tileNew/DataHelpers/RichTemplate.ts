import Images from 'Controls-demo/tileNew/DataHelpers/Images';

export const DATA = [
    {
        id: 0,
        parent: null,
        type: null,
        title: 'Мост',
        image: Images.BRIDGE,
        'parent@': true,
        description: 'папка с мостом',
        imageProportion: '1:1',
        imageViewMode: 'circle',
        imagePosition: 'top',
        gradientType: 'dark',
        isDocument: true,
        width: 300,
        isShadow: true,
    },
    {
        id: 1,
        parent: null,
        type: null,
        title: 'Медведики',
        description: 'Элемент с описанием',
        imageProportion: '16:9',
        titleLines: 1,
        imagePosition: 'top',
        imageViewMode: 'rectangle',
        'parent@': null,
        imageHeight: 's',
        image: Images.MEDVED,
        isShadow: true,
    },
];
export const ITEM_ACTIONS = [
    {
        id: 1,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: 0,
    },
    {
        id: 2,
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: 0,
    },
];
