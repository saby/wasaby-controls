export const data = {
    getDefaultItems: () => {
        return [
            {
                id: '1',
                title: 'Document',
            },
            {
                id: '2',
                title: 'Files',
            },
            {
                id: '3',
                title: 'Orders',
            },
        ];
    },
    getItems1: () => {
        return [
            {
                id: '1',
                title: 'Вкладка',
                caption: 'Вкладка',
                mainCounter: 12,
            },
            {
                id: '2',
                title: 'Вкладка',
                caption: 'Вкладка',
                mainCounter: 12,
            },
            {
                id: '3',
                title: 'Вкладка',
                caption: 'Вкладка',
                mainCounter: 12,
            },
        ];
    },
    getItems3: () => {
        return [
            {
                id: '1',
                title: 'Вкладка',
                icon: 'icon-EmptyMessage',
                iconTooltip: 'cloud',
            },
            {
                id: '2',
                title: 'Вкладка',
                icon: 'icon-EmptyMessage',
            },
            {
                id: '3',
                title: 'Вкладка',
                icon: 'icon-EmptyMessage',
            },
        ];
    },
    getItems4: () => {
        return [
            {
                id: '1',
                title: 'Вкладка',
                mainCounter: 12,
                icon: 'icon-EmptyMessage',
            },
            {
                id: '2',
                title: 'Вкладка',
                mainCounter: 12,
                icon: 'icon-EmptyMessage',
            },
            {
                id: '3',
                title: 'Вкладка',
                mainCounter: 12,
                icon: 'icon-EmptyMessage',
            },
        ];
    },
    getItems5: () => {
        return [
            {
                id: '1',
                title: 'Вкладка',
                mainCounter: 12,
                icon: 'icon-EmptyMessage',
                caption: 'Всего',
                additionalCaption: ' 11.11.2021',
            },
            {
                id: '2',
                title: 'Вкладка',
                mainCounter: 12,
                icon: 'icon-EmptyMessage',
                caption: 'Всего',
                additionalCaption: '11.11.2021',
            },
            {
                id: '3',
                title: 'Вкладка',
                mainCounter: 12,
                icon: 'icon-EmptyMessage',
                caption: 'Всего',
                additionalCaption: '11.11.2021',
            },
        ];
    },
    getItems6: () => {
        return [
            {
                id: '1',
                icon: 'icon-Lenta',
            },
            {
                id: '2',
                icon: 'icon-Lenta',
            },
            {
                id: '3',
                icon: 'icon-Lenta',
            },
        ];
    },
    getItems7: () => {
        return [
            {
                id: '1',
                icon: 'icon-EmptyMessage',
                mainCounter: 12,
            },
            {
                id: '2',
                icon: 'icon-EmptyMessage',
                mainCounter: 12,
            },
            {
                id: '3',
                icon: 'icon-EmptyMessage',
                mainCounter: 12,
            },
        ];
    },
    getItems8: () => {
        return [
            {
                id: '1',
                icon: 'icon-Show',
                iconTooltip: 'eye',
                caption: 'Вкладка',
            },
            {
                id: '2',
                icon: 'icon-Show',
                caption: 'Вкладка',
            },
            {
                id: '3',
                icon: 'icon-Show',
                caption: 'Вкладка',
            },
        ];
    },
    getItems9: () => {
        return [
            {
                id: '1',
                image: {
                    src: 'data:image/png;base64,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',
                },
                caption: 'Вкладка',
            },
            {
                id: '2',
                image: {
                    src: 'data:image/png;base64,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',
                },
                caption: 'Вкладка',
            },
            {
                id: '3',
                image: {
                    src: 'data:image/png;base64,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',
                },
                caption: 'Вкладка',
            },
        ];
    },
    getItems10: () => {
        return [
            {
                id: '1',
                caption: 'Сотрудники',
                icon: 'icon-AddContact',
            },
            {
                id: '2',
                caption: 'Контакты',
                icon: 'icon-EmptyMessage',
            },
            {
                id: '3',
                caption: 'Звонки',
                icon: 'icon-Call',
            },
        ];
    },
    getDefaultLeftItems() {
        const rawData = this.getDefaultItems();
        for (const item of rawData) {
            item.align = 'left';
        }
        return rawData;
    },

    getCustomItems: () => {
        return [
            {
                id: '1',
                title: 'Document',
                caption: 'Документы',
            },
            {
                id: '2',
                title: 'Files',
                caption: 'Файлы',
            },
            {
                id: '3',
                title: 'Orders',
                caption: 'Заказы',
            },
        ];
    },
};
