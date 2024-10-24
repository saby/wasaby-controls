export const palette = [
    {
        color: '--secondary_color',
    },
    {
        color: '--primary_color',
    },
    {
        color: '--danger_color',
    },
    {
        color: '--success_color',
    },
    {
        color: '--warning_color',
    },
    {
        color: '--info_text-color',
    },
    {
        color: '--brand_color',
    },
    {
        color: '--info_border-color',
    },
    {
        color: '--text-color',
    },
];
export const items = [
    {
        readOnly: true,
        id: '0',
        type: 'style',
        value: {
            color: '--danger_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Красный',
        removable: true,
        editable: true,
    },
    {
        id: '1',
        type: 'color',
        value: {
            color: '--success_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Зеленый',
    },
    {
        id: '2',
        type: 'color',
        value: {
            color: '--secondary_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Синий',
        removable: true,
        editable: true,
    },
    {
        id: '3',
        type: 'style',
        value: {
            color: '--warning_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Желтый',
        removable: true,
        editable: true,
    },
];
export const itemsWithDisabled = [
    {
        id: '0',
        type: 'style',
        value: {
            color: '--danger_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Красный',
        removable: true,
        editable: false,
    },
    {
        id: '1',
        type: 'color',
        value: {
            color: '--success_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Зеленый',
        editableStyle: false,
    },
    {
        id: '2',
        type: 'color',
        value: {
            color: '--secondary_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Синий',
        removable: true,
        editable: true,
    },
    {
        id: '3',
        type: 'color',
        value: {
            color: '--warning_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Желтый',
        removable: false,
        editable: true,
    },
];
export const itemsWithCustom = [
    {
        id: '4',
        icon: 'Flag',
        iconStyle: 'primary',
        iconSize: 'm',
        caption: 'Важный',
        tooltip: 'Описание пометки с флагом',
    },
    {
        id: '5',
        icon: 'Add',
        iconClassName: 'controlsColorsDemo__icon controlsColorsDemo__dangerIcon',
        iconSize: 'm',
        caption: 'Плюс',
        disabled: true,
    },
    {
        id: '0',
        type: 'style',
        value: {
            color: '--danger_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Красный',
        removable: true,
        editable: true,
    },
    {
        id: '1',
        type: 'color',
        value: {
            color: '--success_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Зеленый',
    },
    {
        id: '2',
        type: 'color',
        value: {
            color: '--secondary_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Синий',
        removable: true,
        editable: true,
    },
    {
        id: '3',
        type: 'color',
        value: {
            color: '--warning_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Желтый',
        removable: true,
        disabled: true,
    },
];

export const itemsWithPartialSelected = [
    {
        id: '4',
        icon: 'Flag',
        iconStyle: 'primary',
        iconSize: 'm',
        caption: 'Важный',
        tooltip: 'Описание пометки с флагом',
        partialSelected: true,
    },
    {
        id: '5',
        icon: 'Add',
        iconClassName: 'controlsColorsDemo__icon controlsColorsDemo__dangerIcon',
        iconSize: 'm',
        caption: 'Плюс',
        disabled: true,
    },
    {
        id: '0',
        type: 'style',
        value: {
            color: '--danger_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Красный',
        removable: true,
        editable: true,
    },
    {
        id: '1',
        type: 'color',
        value: {
            color: '--success_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Зеленый',
    },
    {
        id: '2',
        type: 'color',
        value: {
            color: '--secondary_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Синий',
        removable: true,
        editable: true,
    },
    {
        id: '3',
        type: 'color',
        value: {
            color: '--warning_color',
            style: {
                b: true,
                i: true,
                u: true,
                s: true,
            },
        },
        caption: 'Желтый',
        removable: true,
        disabled: true,
    },
];
