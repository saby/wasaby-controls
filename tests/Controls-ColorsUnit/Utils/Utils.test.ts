import {
    getColor,
    getStyleClasses,
    isElementContainsFieldOnArr
} from 'Controls-Colors/utils/function';
import { Model } from 'Types/entity';

describe('Controls-Colors/Utils', () => {
    describe('getColor', () => {
        it('variables', () => {
            const item = new Model({
                keyProperty: 'id',
                rawData: {
                    value: {
                        color: '--text-color'
                    }
                },
            });
            expect(getColor(item)).toEqual('var(--text-color)');
        });

        it('color model', () => {
            const item = new Model({
                keyProperty: 'id',
                rawData: {
                    value: {
                        color: 'rgba(125,25,90,0.4)'
                    }
                },
            });
            expect(getColor(item)).toEqual('rgba(125,25,90,0.4)');
        });
    });
    describe('getStyleClasses', () => {
        it('bold is true', () => {
            expect(getStyleClasses({
                b: true,
                u: false,
                i: false,
                s: false
            })).toEqual('Colormark__List_styleSettings_style_bold ');
        });
        it('underline is true', () => {
            expect(getStyleClasses({
                b: false,
                u: true,
                i: false,
                s: false
            })).toEqual('Colormark__List_styleSettings_style_underline ');
        });
        it('italic is true', () => {
            expect(getStyleClasses({
                b: false,
                u: false,
                i: true,
                s: false
            })).toEqual('Colormark__List_styleSettings_style_italic ');
        });
        it('italic is true', () => {
            expect(getStyleClasses({
                b: false,
                u: false,
                i: false,
                s: true
            })).toEqual('Colormark__List_styleSettings_style_stroked');
        });
        it('all', () => {
            expect(getStyleClasses({
                b: true,
                u: true,
                i: true,
                s: true
            })).toEqual('Colormark__List_styleSettings_style_bold Colormark__List_styleSettings_style_underline' +
                        ' Colormark__List_styleSettings_style_italic Colormark__List_styleSettings_style_stroked');
        });
    });
    describe('isElementContainsFieldOnArr', () => {
        it('check in items', () => {
            const items = [
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
                        }
                    },
                    caption: 'Красный',
                    removable: true,
                    editable: true
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
                        }
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
                        }
                    },
                    caption: 'Синий',
                    removable: true,
                    editable: true
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
                        }
                    },
                    caption: 'Желтый',
                    removable: true,
                    editable: true
                }
            ];
            expect(isElementContainsFieldOnArr('icon', items)).toEqual(false);
            expect(isElementContainsFieldOnArr('icon', [
                ...items,
                {
                    id: '4',
                    icon: 'Flag',
                    iconStyle: 'primary',
                    iconSize: 'm',
                    caption: 'Важный'
                }
            ])).toEqual(true);
        });
    });
});
