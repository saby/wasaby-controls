define(['Controls/baseDecorator'], function (decorator) {
   'use strict';

   describe('Controls.baseDecorator.Money', function () {
      var ctrl;
      beforeEach(function () {
         ctrl = decorator.MoneyFunctions;
      });

      describe('parseNumber', function () {
         it('value: null, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(null, false, 'none', 2)
            ).toEqual({
               number: '',
               tooltip: '',
               integer: '',
               fraction: ''
            });
         });
         it('value: 0.035, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(0.035, false, 'none', 2)
            ).toEqual({
               number: '0.03',
               tooltip: '0.03',
               integer: '0',
               fraction: '.03'
            });
         });
         it('value: 0.075, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(0.075, false, 'none', 2)
            ).toEqual({
               number: '0.07',
               tooltip: '0.07',
               integer: '0',
               fraction: '.07'
            });
         });
         it('value: 20, useGrouping: false', function () {
            expect(ctrl.calculateFormattedNumber(20, false, 'none', 2)).toEqual(
               {
                  number: '20.00',
                  tooltip: '20.00',
                  integer: '20',
                  fraction: '.00'
               }
            );
         });
         it('value: 20.1, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(20.1, false, 'none', 2)
            ).toEqual({
               number: '20.10',
               tooltip: '20.10',
               integer: '20',
               fraction: '.10'
            });
         });
         it('value: 20.18, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(20.18, false, 'none', 2)
            ).toEqual({
               number: '20.18',
               tooltip: '20.18',
               integer: '20',
               fraction: '.18'
            });
         });
         it('value: 20.181, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(20.181, false, 'none', 2)
            ).toEqual({
               number: '20.18',
               tooltip: '20.18',
               integer: '20',
               fraction: '.18'
            });
         });
         it('value: Infinity, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(Infinity, false, 'none', 2)
            ).toEqual({
               number: '0.00',
               tooltip: '0.00',
               integer: '0',
               fraction: '.00'
            });
         });
         it('value: 1000.00, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(1000.0, false, 'none', 2)
            ).toEqual({
               number: '1000.00',
               tooltip: '1000.00',
               integer: '1000',
               fraction: '.00'
            });
         });
         it('value: 1000.00, useGrouping: true', function () {
            expect(
               ctrl.calculateFormattedNumber(1000.0, true, 'none', 2)
            ).toEqual({
               number: '1 000.00',
               tooltip: '1 000.00',
               integer: '1 000',
               fraction: '.00'
            });
         });
         it('value: -1000.00, useGrouping: false', function () {
            expect(
               ctrl.calculateFormattedNumber(-1000.0, false, 'none', 2)
            ).toEqual({
               number: '- 1000.00',
               tooltip: '- 1000.00',
               integer: '- 1000',
               fraction: '.00'
            });
         });
         it('value: -1000.00, useGrouping: true', function () {
            expect(
               ctrl.calculateFormattedNumber(-1000.0, true, 'none', 2)
            ).toEqual({
               number: '- 1 000.00',
               tooltip: '- 1 000.00',
               integer: '- 1 000',
               fraction: '.00'
            });
         });
         it('value: 1234e20, useGrouping: true', function () {
            expect(
               ctrl.calculateFormattedNumber(1234e17, true, 'none', 2)
            ).toEqual({
               number: '123 400 000 000 000 000 000.00',
               tooltip: '123 400 000 000 000 000 000.00',
               integer: '123 400 000 000 000 000 000',
               fraction: '.00'
            });
         });
         it('value: 1290, precision: 0', function () {
            expect(
               ctrl.calculateFormattedNumber(1290, true, 'none', 0)
            ).toEqual({
               number: '1 290',
               tooltip: '1 290',
               integer: '1 290',
               fraction: ''
            });
         });
         it('value: 1290, precision: 2', function () {
            expect(
               ctrl.calculateFormattedNumber(1290, true, 'none', 2)
            ).toEqual({
               number: '1 290.00',
               tooltip: '1 290.00',
               integer: '1 290',
               fraction: '.00'
            });
            expect(
               ctrl.calculateFormattedNumber(1290.756, true, 'none', 2)
            ).toEqual({
               number: '1 290.75',
               tooltip: '1 290.75',
               integer: '1 290',
               fraction: '.75'
            });
         });
         it('value: 1290, precision: 4', function () {
            expect(
               ctrl.calculateFormattedNumber(1290, true, 'none', 4)
            ).toEqual({
               number: '1 290.0000',
               tooltip: '1 290.0000',
               integer: '1 290',
               fraction: '.0000'
            });
            expect(
               ctrl.calculateFormattedNumber(1290.075, true, 'none', 4)
            ).toEqual({
               number: '1 290.0750',
               tooltip: '1 290.0750',
               integer: '1 290',
               fraction: '.0750'
            });
            expect(
               ctrl.calculateFormattedNumber(1290.75, true, 'none', 4)
            ).toEqual({
               number: '1 290.7500',
               tooltip: '1 290.7500',
               integer: '1 290',
               fraction: '.7500'
            });
            expect(
               ctrl.calculateFormattedNumber(1290.7666, true, 'none', 4)
            ).toEqual({
               number: '1 290.7666',
               tooltip: '1 290.7666',
               integer: '1 290',
               fraction: '.7666'
            });
            expect(
               ctrl.calculateFormattedNumber(1290.766665, true, 'none', 4)
            ).toEqual({
               number: '1 290.7666',
               tooltip: '1 290.7666',
               integer: '1 290',
               fraction: '.7666'
            });
         });
      });
      describe('tooltip', function () {
         it('value: "0.00"', function () {
            expect(ctrl.calculateTooltip({ number: '0.00' }, {}, 2)).toEqual(
               '0.00'
            );
         });
         it('value: "0.12"', function () {
            expect(ctrl.calculateTooltip({ number: '0.12' }, {}, 2)).toEqual(
               '0.12'
            );
         });
         it('value: "0.00", tooltip: "tooltip"', function () {
            expect(
               ctrl.calculateTooltip(
                  { number: '0.00' },
                  { tooltip: 'tooltip' },
                  2
               )
            ).toEqual('tooltip');
         });
      });
      describe('isDisplayFractionPath', function () {
         it('Test1', function () {
            expect(ctrl.isDisplayFractionPath('.00', false, 2)).toBe(false);
         });
         it('Test2', function () {
            expect(ctrl.isDisplayFractionPath('.10', false, 2)).toBe(true);
         });
         it('Test3', function () {
            expect(ctrl.isDisplayFractionPath('.00', true, 2)).toBe(true);
         });
         it('Test4', function () {
            expect(ctrl.isDisplayFractionPath('.10', true, 2)).toBe(true);
         });
         it('Test5', function () {
            expect(ctrl.isDisplayFractionPath('.10', true, 0)).toBe(false);
         });
      });
      describe('calculateMainClass', function () {
         it('fontColorStyle: "default", underline: "hovered"', function () {
            expect(ctrl.calculateMainClass('default', 'hovered')).toEqual(
               'controls-DecoratorMoney controls-DecoratorMoney__underline controls-text-default'
            );
         });
         it('fontColorStyle: "primary", underline: "none"', function () {
            expect(ctrl.calculateMainClass('primary', 'none')).toEqual(
               'controls-DecoratorMoney controls-text-primary'
            );
         });
         it('fontColorStyle: "primary", underline: "none"', function () {
            expect(ctrl.calculateMainClass('primary', 'none')).toEqual(
               'controls-DecoratorMoney controls-text-primary'
            );
         });
         it('fontColorStyle: "primary", underline: "hovered"', function () {
            expect(ctrl.calculateMainClass('primary', 'hovered')).toEqual(
               'controls-DecoratorMoney controls-DecoratorMoney__underline controls-text-primary'
            );
         });
      });

      describe('calculateCurrencyClass', function () {
         it('currencySize: "m", fontColorStyle: "default", fontWeight: "bold"', function () {
            expect(ctrl.calculateCurrencyClass('m', 'default', 'bold')).toEqual(
               'controls-fontsize-m controls-text-default controls-fontweight-bold'
            );
         });
      });

      describe('calculateStrokedClass', function () {
         it('stroked: true', function () {
            expect(ctrl.calculateStrokedClass(true)).toEqual(
               'controls-DecoratorMoney__stroked'
            );
         });
         it('stroked: false', function () {
            expect(ctrl.calculateStrokedClass(false)).toEqual('');
         });
      });

      describe('calculateIntegerClass', function () {
         it('fontSize: "m", fontColorStyle: "default", fontWeight: "bold", "currency": "Euro", currencyPosition: "left", isDisplayFractionPathParam: true', function () {
            expect(
               ctrl.calculateIntegerClass(
                  'm',
                  'default',
                  'bold',
                  'Euro',
                  'left',
                  true
               )
            ).toEqual(
               'controls-fontsize-m controls-text-default controls-fontweight-bold controls-margin_left-2xs'
            );
         });
         it('fontSize: "m", fontColorStyle: "default", fontWeight: "bold", "currency": "Euro", currencyPosition: "right", isDisplayFractionPathParam: false', function () {
            expect(
               ctrl.calculateIntegerClass(
                  'm',
                  'default',
                  'bold',
                  'Euro',
                  'right',
                  false
               )
            ).toEqual(
               'controls-fontsize-m controls-text-default controls-fontweight-bold controls-margin_right-2xs'
            );
         });
         it('fontSize: "m", fontColorStyle: "default", fontWeight: "bold", "currency": "Euro", currencyPosition: "right", isDisplayFractionPathParam: true', function () {
            expect(
               ctrl.calculateIntegerClass(
                  'm',
                  'default',
                  'bold',
                  'Euro',
                  'right',
                  true
               )
            ).toEqual(
               'controls-fontsize-m controls-text-default controls-fontweight-bold'
            );
         });
      });

      describe('calculateFractionClass', function () {
         it('fraction: ".00", fontColorStyle: "default", fractionFontSize: "bold", "currency": "Euro", currencyPosition: "left"', function () {
            expect(
               ctrl.calculateFractionClass(
                  '.00',
                  'default',
                  'bold',
                  'Euro',
                  'left'
               )
            ).toEqual(
               'controls-DecoratorMoney__fraction__colorStyle-readonly controls-text-readonly controls-fontsize-bold'
            );
         });
         it('fraction: ".00", fontColorStyle: "default", fractionFontSize: "bold", "currency": "Euro", currencyPosition: "right"', function () {
            expect(
               ctrl.calculateFractionClass(
                  '.00',
                  'default',
                  'bold',
                  'Euro',
                  'right'
               )
            ).toEqual(
               'controls-DecoratorMoney__fraction__colorStyle-readonly controls-text-readonly controls-fontsize-bold controls-margin_right-2xs'
            );
         });
         it('fraction: ".10", fontColorStyle: "default", fractionFontSize: "bold", "currency": "Euro", currencyPosition: "left"', function () {
            expect(
               ctrl.calculateFractionClass(
                  '.10',
                  'default',
                  'bold',
                  'Euro',
                  'left'
               )
            ).toEqual(
               'controls-DecoratorMoney__fraction__colorStyle-label controls-text-label controls-fontsize-bold'
            );
         });
         it('fraction: ".10", fontColorStyle: "default", fractionFontSize: "bold", "currency": "Euro", currencyPosition: "right"', function () {
            expect(
               ctrl.calculateFractionClass(
                  '.10',
                  'default',
                  'bold',
                  'Euro',
                  'right'
               )
            ).toEqual(
               'controls-DecoratorMoney__fraction__colorStyle-label controls-text-label controls-fontsize-bold controls-margin_right-2xs'
            );
         });
         it('fraction: ".10", fontColorStyle: "default", fractionFontSize: "bold", "currency": "Euro", currencyPosition: "right", fontSize: "5xl"', function () {
            expect(
                ctrl.calculateFractionClass(
                    '.10',
                    'default',
                    'bold',
                    'Euro',
                    'right',
                    '5xl'
                )
            ).toEqual(
                'controls-DecoratorMoney__fraction__colorStyle-default controls-text-default controls-fontsize-bold controls-margin_right-2xs'
            );
         });
      });

      describe('calculateCurrency', function () {
         it('"currency": "Ruble"', function () {
            expect(ctrl.calculateCurrency('Ruble')).toEqual('₽');
         });
         it('"currency": "Dollar"', function () {
            expect(ctrl.calculateCurrency('Dollar')).toEqual('$');
         });
         it('"currency": "Euro"', function () {
            expect(ctrl.calculateCurrency('Euro')).toEqual('€');
         });
      });

      describe('calculateFontColorStyle', function () {
         it('stroked: true, readOnly: true, fontColorStyle: "default"', function () {
            const options = {
               readOnly: true,
               fontColorStyle: 'default'
            };
            expect(ctrl.calculateFontColorStyle(true, options)).toEqual(
               'readonly'
            );
         });
         it('stroked: true, readOnly: false, fontColorStyle: "default"', function () {
            const options = {
               readOnly: false,
               fontColorStyle: 'default'
            };
            expect(ctrl.calculateFontColorStyle(true, options)).toEqual(
               'readonly'
            );
         });
         it('stroked: false, readOnly: true, fontColorStyle: "default"', function () {
            const options = {
               readOnly: true,
               fontColorStyle: 'default'
            };
            expect(ctrl.calculateFontColorStyle(false, options)).toEqual(
               'readonly'
            );
         });
         it('stroked: false, readOnly: false, fontColorStyle: "default"', function () {
            const options = {
               readOnly: false,
               fontColorStyle: 'default'
            };
            expect(ctrl.calculateFontColorStyle(false, options)).toEqual(
               'default'
            );
         });
      });

      describe('calculateTooltip', function () {
         it('number: 10, no tooltip', function () {
            const formattedNumber = {
               number: 10,
               fraction: 10
            };
            const options = {};
            expect(ctrl.calculateTooltip(formattedNumber, options)).toEqual(10);
         });
         it('number: 10, with tooltip', function () {
            const formattedNumber = {
               number: 10,
               fraction: 10
            };
            const options = {
               tooltip: 'tooltip'
            };
            expect(ctrl.calculateTooltip(formattedNumber, options)).toEqual(
               'tooltip'
            );
         });
      });

      describe('calculateFractionFontSize', function () {
         it('fontSize: "6xl"', function () {
            expect(ctrl.calculateFractionFontSize('6xl')).toEqual('3xl');
         });
         it('fontSize: "7xl"', function () {
            expect(ctrl.calculateFractionFontSize('7xl')).toEqual('3xl');
         });
         it('fontSize: "8xl"', function () {
            expect(ctrl.calculateFractionFontSize('8xl')).toEqual('3xl');
         });
         it('fontSize: "m"', function () {
            expect(ctrl.calculateFractionFontSize('m')).toEqual('xs');
         });
      });
   });
});
