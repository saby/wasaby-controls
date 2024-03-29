/**
 * Created by am.gerasimov on 06.05.2016.
 */
define('Controls-demo/Search/kbLayoutRevert', [], function () {
   'use strict';

   /**
    * Модуль для преобразования текста, введенного в неверной раскладке. Если передатьь текст в кириллице, то он преобразуется в латиницу.
    * Модуль поставляет единственный метод статический метод {@link #process}.
    * @class SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertUtil
    * @public
    * @example
    * <pre>
    * define(..., ['SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertUtil'], function(KbLayoutRevertUtil) {
    *    ...
    *    var res = KbLayoutRevertUtil.process(someString);
    * });
    * </pre>
    */
   // eslint-disable-next-line max-len
   return /** @lends SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertUtil.prototype SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertUtil */ {
      _layouts: {
         'ru-en':
            'йцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮqwertyuiop[]asdfghjkl;\'zxcvbnm,.QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>'
      },
      _cache: {
         layoutObjects: {},
         layoutObjectsSplit: {}
      },
      _getLayoutObject: function (layoutId, split) {
         var result, layout, i;

         if (!this._layouts[layoutId]) {
            return;
         }

         layout = this._layouts[layoutId];

         if (split) {
            result = {};
            if (this._cache.layoutObjectsSplit.hasOwnProperty(layoutId)) {
               return this._cache.layoutObjectsSplit[layoutId];
            }

            result.straight = {};
            result.reverse = {};

            var half = layout.length / 2;

            for (i = 0; i < half; ++i) {
               result.straight[layout[i]] = layout[i + half];
               result.reverse[layout[i + half]] = layout[i];
            }
            this._cache.layoutObjectsSplit[layoutId] = result;
         } else {
            result = [];
            if (this._cache.layoutObjects.hasOwnProperty(layoutId)) {
               return this._cache.layoutObjects[layoutId];
            }

            for (i = 0; i < layout.length; ++i) {
               result[layout[i]] = 0;
            }
            this._cache.layoutObjects[layoutId] = result;
         }

         return result;
      },
      _figureLayout: function (text) {
         var result = { matches: 0, layoutId: null };
         for (var layoutId in this._layouts) {
            if (this._layouts.hasOwnProperty(layoutId)) {
               var layoutObj = this._getLayoutObject(layoutId),
                  matches = 0;

               for (var i = 0; i < text.length; ++i) {
                  if (layoutObj.hasOwnProperty(text[i])) {
                     ++matches;
                  }
               }

               if (!result || result.matches < matches) {
                  result = { matches: matches, layoutId: layoutId };
               }
            }
         }

         return result;
      },
      _figureConversionDirectionByWorlds: function (text, layoutId) {
         var layoutObj = this._getLayoutObject(layoutId, true),
            words = text.split(/\s/),
            totalDir = 0,
            dir,
            wordsConv = [];

         words.forEach(function (word) {
            if (!word) {
               wordsConv.push({ word: ' ' });
               return;
            }

            var straight = 0,
               reverse = 0;

            for (var i = 0; i < word.length; ++i) {
               if (layoutObj.straight.hasOwnProperty(word[i])) {
                  ++straight;
               }
               if (layoutObj.reverse.hasOwnProperty(word[i])) {
                  ++reverse;
               }
            }

            dir = straight >= reverse ? 1 : -1;
            if (straight && reverse) {
               dir = straight >= reverse ? -1 : 1;
            }
            totalDir += dir;
            wordsConv.push({ word: word, direction: dir });
         });

         return { direction: totalDir < 0 ? -1 : 1, words: wordsConv };

         // return (totalDir < 0) ? -1 : 1;
      },

      /**
       * Проецирует текст введенный в одной раскладке в другую раскладку. Успешно обрабатываются только те случаи, когда каждое слово введено в ошибочной раскладке.
       * @param {String} text Текст для преобразования.
       * @param {String} [layoutId] Идентификатор раскладки. Если не указан, определяет сам.
       * @returns {String}
       * @example
       * <pre>
       *    ghbdtn, Fktrc! => привет, Алекс!       OK
       *    ghbdtn, Фдуч! => привет, Alex!         OK (в процессе ввода была смена раскладки, но оба слова введены в ошибочной раскладке)
       *    ghbdtn, Alex! => привет, Флуч!         BAD (по смыслу второе слово введено верно)
       * </pre>
       */
      process: function (text, layoutId) {
         var innerLayoutId = layoutId || this._figureLayout(text).layoutId;

         if (!innerLayoutId) {
            return text;
         }

         var directionByWorld = this._figureConversionDirectionByWorlds(
               text,
               innerLayoutId
            ),
            layoutObj = this._getLayoutObject(innerLayoutId, true),
            layoutMap =
               directionByWorld.direction === 1
                  ? layoutObj.straight
                  : layoutObj.reverse,
            result = '';

         directionByWorld.words.forEach(function (wordDef) {
            var word = wordDef.word;

            if (word === ' ') {
               result += word;
               return;
            }

            layoutMap =
               wordDef.direction === 1 ? layoutObj.straight : layoutObj.reverse;

            if (result.trim().length > 0) {
               result += ' ';
            }

            for (var i = 0; i < word.length; ++i) {
               if (layoutMap.hasOwnProperty(word[i])) {
                  result += layoutMap[word[i]];
               } else {
                  result += word[i];
               }
            }
         });

         return result;
      }
   };
});
