define(['Controls/baseDecorator'], function (decorator) {
   'use strict';

   describe('Controls.baseDecorator:MaskFormatBuilder', function () {
      const MaskFormatBuilder = decorator.FormatBuilder;

      it('PAIR_DELIMITERS', function () {
         expect(MaskFormatBuilder.PAIR_DELIMITERS).toEqual(
            '(){}[]⟨⟩<>\'\'""«»„“‘’””'
         );
      });

      it('getMaskParsing', function () {
         const actual = MaskFormatBuilder.getMaskParsing('Lldx');
         expect(actual).toEqual(
            /* eslint-disable-next-line no-useless-escape */
            /([Lldx])(?:\\({.*?}|.))?|([\(\)\{\}\[\]⟨⟩<>\'\'\"\"«»„“‘’””])|(.)/g
         );
      });

      describe('getMaskKeys', function () {
         it('Empty object', function () {
            const actual = MaskFormatBuilder.getMaskKeys({});
            expect(actual).toEqual('');
         });
         it('Fill object', function () {
            const actual = MaskFormatBuilder.getMaskKeys({
               d: '[0-9]',
               l: '[a-z]'
            });
            expect(actual).toEqual('dl');
         });
      });

      describe('delimiterSubtype', function () {
         it('Open', function () {
            const actual = MaskFormatBuilder.delimiterSubtype('(');
            expect(actual).toEqual('open');
         });
         it('Close', function () {
            const actual = MaskFormatBuilder.delimiterSubtype(')');
            expect(actual).toEqual('close');
         });
         it('Error', function () {
            const actual = MaskFormatBuilder.delimiterSubtype.bind(
               MaskFormatBuilder,
               '-'
            );
            expect(actual).toThrow();
         });
      });
      describe('pairOfDelimiter', function () {
         it('Open', function () {
            const actual = MaskFormatBuilder.pairOfDelimiter('(', 'open');
            expect(actual).toEqual(')');
         });
         it('Close', function () {
            const actual = MaskFormatBuilder.pairOfDelimiter(')', 'close');
            expect(actual).toEqual('(');
         });
         it('Error subtype open', function () {
            const actual = MaskFormatBuilder.pairOfDelimiter.bind(
               MaskFormatBuilder,
               ')',
               'open'
            );
            expect(actual).toThrow();
         });
         it('Error subtype close', function () {
            const actual = MaskFormatBuilder.pairOfDelimiter.bind(
               MaskFormatBuilder,
               '(',
               'close'
            );
            expect(actual).toThrow();
         });
      });

      describe('getCharData', function () {
         it('Key', function () {
            const actual = MaskFormatBuilder.getCharData([
               'd',
               'd',
               undefined,
               undefined,
               undefined
            ]);
            expect(actual).toEqual({
               type: 'key',
               value: 'd',
               quantifier: ''
            });
         });
         it('Key and quantifier', function () {
            const actual = MaskFormatBuilder.getCharData([
               'd\\{2}',
               'd',
               '{2}',
               undefined,
               undefined
            ]);
            expect(actual).toEqual({
               type: 'key',
               value: 'd',
               quantifier: '{2}'
            });
         });
         it('Open pair delimiter', function () {
            const actual = MaskFormatBuilder.getCharData([
               '(',
               undefined,
               undefined,
               '(',
               undefined
            ]);
            expect(actual).toEqual({
               type: 'pairDelimiter',
               value: '(',
               pair: ')',
               subtype: 'open'
            });
         });
         it('Close pair delimiter', function () {
            const actual = MaskFormatBuilder.getCharData([
               ')',
               undefined,
               undefined,
               ')',
               undefined
            ]);
            expect(actual).toEqual({
               type: 'pairDelimiter',
               value: ')',
               pair: '(',
               subtype: 'close'
            });
         });
         it('Single delimiter', function () {
            const actual = MaskFormatBuilder.getCharData([
               '-',
               undefined,
               undefined,
               undefined,
               '-'
            ]);
            expect(actual).toEqual({
               type: 'singleDelimiter',
               value: '-'
            });
         });
         it('Error', function () {
            const actual = MaskFormatBuilder.getCharData.bind(
               MaskFormatBuilder,
               ['', undefined, undefined, undefined, undefined]
            );
            expect(actual).toThrow();
         });
      });

      describe('getReplacingKeyAsValue', function () {
         const formatMaskChars = {
            d: '[0-9]'
         };
         it('Key', function () {
            const actual = MaskFormatBuilder.getReplacingKeyAsValue(
               formatMaskChars,
               'd',
               ''
            );
            expect(actual).toEqual('[0-9]');
         });
         it('Key and quantifier', function () {
            const actual = MaskFormatBuilder.getReplacingKeyAsValue(
               formatMaskChars,
               'd',
               '{2}'
            );
            expect(actual).toEqual('[0-9]{2}');
         });
      });

      describe('getReplacingKeyAsValueOrReplacer', function () {
         const formatMaskChars = {
            d: '[0-9]'
         };
         it('Key', function () {
            const actual = MaskFormatBuilder.getReplacingKeyAsValueOrReplacer(
               formatMaskChars,
               '_',
               'd',
               ''
            );
            expect(actual).toEqual('(?:[0-9]|_)');
         });
         it('Key and quantifier', function () {
            const actual = MaskFormatBuilder.getReplacingKeyAsValueOrReplacer(
               formatMaskChars,
               '_',
               'd',
               '{2}'
            );
            expect(actual).toEqual('(?:[0-9]|_){2}');
         });
      });

      describe('getReplacingKeyFn', function () {
         const formatMaskChars = {
            d: '[0-9]'
         };
         it('Empty replacer', function () {
            const actual = MaskFormatBuilder.getReplacingKeyFn(
               formatMaskChars,
               ''
            );
            expect(actual.name).toEqual('bound getReplacingKeyAsValue');
         });
         it('Not empty replacer', function () {
            const actual = MaskFormatBuilder.getReplacingKeyFn(
               formatMaskChars,
               '_'
            );
            expect(actual.name).toEqual(
               'bound getReplacingKeyAsValueOrReplacer'
            );
         });
      });
      describe('getFormat', function () {
         const formatMaskChars = {
            d: '[0-9]',
            l: '[а-яa-zё]'
         };
         it('dl.ld without replacer', function () {
            const actual = MaskFormatBuilder.getFormat(
               'dl.ld',
               formatMaskChars,
               ''
            );
            expect(actual.searchingGroups).toEqual(
               '^(?:([0-9][а-яa-zё])(\\.?)([а-яa-zё][0-9])|([0-9][а-яa-zё])(\\.?)([а-яa-zё])|([0-9][а-яa-zё])(\\.?)|([0-9])|)$'
            );
            expect(actual.delimiterGroups).toEqual({
               1: {
                  value: '.',
                  type: 'singleDelimiter'
               }
            });
         });
         it('dl.ld with replacer', function () {
            const actual = MaskFormatBuilder.getFormat(
               'dl.ld',
               formatMaskChars,
               '_'
            );
            expect(actual.searchingGroups).toEqual(
               '^(?:((?:[0-9]|_)(?:[а-яa-zё]|_))(\\.?)((?:[а-яa-zё]|_)(?:[0-9]|_)))$'
            );
            expect(actual.delimiterGroups).toEqual({
               1: {
                  value: '.',
                  type: 'singleDelimiter'
               }
            });
         });
         it('(dd)-[ll] without replacer', function () {
            const actual = MaskFormatBuilder.getFormat(
               '(dd)-[ll]',
               formatMaskChars,
               ''
            );
            expect(actual.searchingGroups).toEqual(
               '^(?:(\\(?)([0-9][0-9])(\\)?)(-?)(\\[?)([а-яa-zё][а-яa-zё])(\\]?)|(\\(?)([0-9][0-9])(\\)?)(-?)(\\[?)([а-яa-zё])|(\\(?)([0-9][0-9])(\\)?)(-?)(\\[?)|(\\(?)([0-9])|(\\(?))$'
            );
            expect(actual.delimiterGroups).toEqual({
               0: {
                  value: '(',
                  type: 'pairDelimiter',
                  subtype: 'open',
                  pair: ')'
               },
               2: {
                  value: ')',
                  type: 'pairDelimiter',
                  subtype: 'close',
                  pair: '('
               },
               3: {
                  value: '-',
                  type: 'singleDelimiter'
               },
               4: {
                  value: '[',
                  type: 'pairDelimiter',
                  subtype: 'open',
                  pair: ']'
               },
               6: {
                  value: ']',
                  type: 'pairDelimiter',
                  subtype: 'close',
                  pair: '['
               }
            });
         });
         it('(dd)-[ll] with replacer', function () {
            const actual = MaskFormatBuilder.getFormat(
               '(dd)-[ll]',
               formatMaskChars,
               '_'
            );
            expect(actual.searchingGroups).toEqual(
               '^(?:(\\(?)((?:[0-9]|_)(?:[0-9]|_))(\\)?)(-?)(\\[?)((?:[а-яa-zё]|_)(?:[а-яa-zё]|_))(\\]?))$'
            );
            expect(actual.delimiterGroups).toEqual({
               0: {
                  value: '(',
                  type: 'pairDelimiter',
                  subtype: 'open',
                  pair: ')'
               },
               2: {
                  value: ')',
                  type: 'pairDelimiter',
                  subtype: 'close',
                  pair: '('
               },
               3: {
                  value: '-',
                  type: 'singleDelimiter'
               },
               4: {
                  value: '[',
                  type: 'pairDelimiter',
                  subtype: 'open',
                  pair: ']'
               },
               6: {
                  value: ']',
                  type: 'pairDelimiter',
                  subtype: 'close',
                  pair: '['
               }
            });
         });
         it('Error', function () {
            const actual = MaskFormatBuilder.getFormat.bind(
               MaskFormatBuilder,
               '(d[d)]',
               formatMaskChars,
               ''
            );
            expect(actual).toThrow();
         });
      });
   });
});
