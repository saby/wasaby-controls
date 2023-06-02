interface ILayoutResult {
    straight: object;
    reverse: object;
}

interface IFigureConversion {
    direction: 1 | -1;
    words: { word: string; direction: number }[];
}

const KeyboardLayoutRevert = {
    _layouts: {
        'ru-en':
            'йцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ' +
            'qwertyuiop[]asdfghjkl;\'zxcvbnm,.QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>',
    },
    _cache: {
        layoutObjects: {},
        layoutObjectsSplit: {},
    },

    _getLayoutObject(layoutId: string, split?: boolean): ILayoutResult {
        let result;

        if (!this._layouts[layoutId]) {
            return;
        }

        const layout = this._layouts[layoutId];

        if (split) {
            result = {};
            if (this._cache.layoutObjectsSplit.hasOwnProperty(layoutId)) {
                return this._cache.layoutObjectsSplit[layoutId];
            }

            result.straight = {};
            result.reverse = {};

            const half = layout.length / 2;

            for (let i = 0; i < half; ++i) {
                result.straight[layout[i]] = layout[i + half];
                result.reverse[layout[i + half]] = layout[i];
            }
            this._cache.layoutObjectsSplit[layoutId] = result;
        } else {
            result = [];
            if (this._cache.layoutObjects.hasOwnProperty(layoutId)) {
                return this._cache.layoutObjects[layoutId];
            }

            for (let i = 0; i < layout.length; ++i) {
                result[layout[i]] = 0;
            }
            this._cache.layoutObjects[layoutId] = result;
        }

        return result;
    },

    _figureLayout(text: string): string {
        let result: string = null;
        let currentMatches: number = 0;
        for (const layoutId in this._layouts) {
            if (this._layouts.hasOwnProperty(layoutId)) {
                const layoutObj = this._getLayoutObject(layoutId);
                let matches = 0;

                for (let i = 0; i < text.length; ++i) {
                    if (layoutObj.hasOwnProperty(text[i])) {
                        ++matches;
                    }
                }

                if (!result || currentMatches < matches) {
                    result = layoutId;
                    currentMatches = matches;
                }
            }
        }

        return result;
    },

    _figureConversionDirectionByWorlds(text, layoutId): IFigureConversion {
        const layoutObj = this._getLayoutObject(layoutId, true);
        const words = text.split(/\s/);
        let totalDir = 0;
        let dir;
        const wordsConv = [];

        words.forEach(function (word) {
            if (!word) {
                wordsConv.push({ word: ' ' });
                return;
            }

            let straight = 0;
            let reverse = 0;

            for (let i = 0; i < word.length; ++i) {
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
            wordsConv.push({ word, direction: dir });
        });

        return { direction: totalDir < 0 ? -1 : 1, words: wordsConv };
    },

    process(text: string): string {
        const innerLayoutId = this._figureLayout(text);

        if (!innerLayoutId) {
            return text;
        }

        const directionByWorld = this._figureConversionDirectionByWorlds(
            text,
            innerLayoutId
        );
        const layoutObj = this._getLayoutObject(innerLayoutId, true);
        let layoutMap =
            directionByWorld.direction === 1
                ? layoutObj.straight
                : layoutObj.reverse;
        let result = '';

        directionByWorld.words.forEach(function (wordDef) {
            const word = wordDef.word;

            if (word === ' ') {
                result += word;
                return;
            }

            layoutMap =
                wordDef.direction === 1
                    ? layoutObj.straight
                    : layoutObj.reverse;

            if (result.trim().length > 0) {
                result += ' ';
            }

            for (let i = 0; i < word.length; ++i) {
                if (layoutMap.hasOwnProperty(word[i])) {
                    result += layoutMap[word[i]];
                } else {
                    result += word[i];
                }
            }
        });

        return result;
    },
};

export default KeyboardLayoutRevert;
