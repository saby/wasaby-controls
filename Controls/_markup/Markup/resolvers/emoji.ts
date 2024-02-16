import {EMOJI_REGEX} from '../resources/linkDecorateUtils';
import { object } from 'Types/util';

const EMOJI_CLASS_NAME = 'LinkDecorator__emoji';

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

export default function parseEmojis(node) {
    let childrenIndex = 1;
    const ATTRIBUTES_INDEX = 1;

    const isAttrsCandidateString = isString(node[ATTRIBUTES_INDEX]);
    const isAttrsCandidateArray = Array.isArray(node[ATTRIBUTES_INDEX]);
    if (node[ATTRIBUTES_INDEX] && !isAttrsCandidateString && !isAttrsCandidateArray) {
        childrenIndex = 2;
    }

    const newNode = object.clone(node);
    let isModelChanged = false;

    for (let i = childrenIndex; i < node.length; i++) {
        const isChildrenString = node[i] && isString(node[i]);
        const isClassString = isString(node[ATTRIBUTES_INDEX]?.class);
        const isEmojiNode =
            isClassString && node[ATTRIBUTES_INDEX]?.class?.includes(EMOJI_CLASS_NAME);
        if (isChildrenString && !isEmojiNode) {
            newNode[i] = [];

            const processedText = node[i];
            const ZERO_WIDTH_REGEX = /\uFE0F/g;
            const EMPTY_STRING = '';
            let emojiParseExec;
            let index = 0;

            const regex = new RegExp(EMOJI_REGEX);
            while ((emojiParseExec = regex.exec(processedText)) !== null) {
                isModelChanged = true;
                const emoji = emojiParseExec[0];
                const emojiIndex = emojiParseExec.index;
                const text = processedText.slice(index, emojiIndex);
                if (text.length) {
                    newNode[i].push(['span', text]);
                }
                const emojiElement = ['span', {
                    class: EMOJI_CLASS_NAME + ' richEditor_Base-RichEditor__noneditable'
                }, emoji];
                newNode[i].push(emojiElement);
                index = emojiIndex + emoji.length;
            }

            if (isModelChanged) {
                // если после последнего найденного смайлика остался текст, создаем еще один текстовый элемент
                let textAfterLastEmoji = processedText.slice(index, processedText.length);

                // В строке может быть символ нулевой ширины, который визуально не виден.
                // Если он единственный в тексте после эмодзи,
                // то нет смысла создавать под него отдельную текстовую ноду,
                // иначе на его место будет вставать курсор при навигации, что введет пользователя в заблуждение.
                textAfterLastEmoji = textAfterLastEmoji.replace(ZERO_WIDTH_REGEX, EMPTY_STRING);

                if (textAfterLastEmoji.length) {
                    newNode[i].push(['span', textAfterLastEmoji]);
                }
            }

            if (!newNode[i].length) {
                newNode[i] = node[i];
            }
        }
    }
    return isModelChanged ? newNode : node;
}
