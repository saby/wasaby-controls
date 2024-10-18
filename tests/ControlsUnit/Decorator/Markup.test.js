/**
 * @jest-environment jsdom
 */
define([
   'Controls/markup',
   'Controls/_markup/Markup/resources/template',
   'Controls/_markup/Markup/resources/linkDecorateUtils',
   'Env/Env',
   'UI/Base',
   'Core/validHtml'
], function (decorator, template, linkDecorateUtils, Env, UIBase, validHtml) {
   'use strict';

   var global = (function () {
      // eslint-disable-next-line no-eval
      return this || (0, eval)('this');
   })();

   // В окружении юнит тестирования на сервере нет объекта contents, а для теста headJson там должен быть Controls.
   if (!global.contents) {
      global.contents = {
         modules: {
            Controls: {}
         }
      };
   }

   var simpleNode = ['span', 'text'],
      deepNode = [
         'span',
         {
            style: 'text-decoration: line-through;',
            'data-mce-style': 'text-decoration: line-through;'
         },
         'text',
         [
            'strong',
            'text',
            [
               'em',
               'text',
               [
                  'span',
                  {
                     style: 'text-decoration: underline;',
                     'data-mce-style': 'text-decoration: underline;'
                  },
                  'text'
               ],
               'text'
            ],
            'text'
         ],
         'text'
      ],
      decoratedLinkFirstChildNode = [
         'a',
         {
            href: 'https://ya.ru',
            target: '_blank',
            class: 'LinkDecorator__linkWrap',
            rel: 'noreferrer noopener'
         },
         [
            'img',
            {
               class: 'LinkDecorator__image',
               alt: 'https://ya.ru',
               src: '/test/?method=LinkDecorator.DecorateSVG&params=eyJMaW5rIjoiaHR0cHM6Ly95YS5ydSJ9&id=0&srv=1'
            }
         ]
      ],
      attributedNode = ['span', { class: 'someClass' }, 'text'],
      linkNode = [
         'a',
         {
            class: 'asLink',
            rel: 'noreferrer noopener',
            href: 'https://ya.ru',
            target: '_blank'
         },
         'https://ya.ru'
      ],
      wwwLinkNode = [
         'a',
         {
            class: 'asLink',
            rel: 'noreferrer noopener',
            href: 'http://www.ya.ru',
            target: '_blank'
         },
         'www.ya.ru'
      ],
      decoratedLinkService,
      decoratedLinkHost,
      currentVersion = '2',
      nbsp = String.fromCharCode(160),
      openTagRegExp = /(<[^/][^ >]* )([^>]*")(( \/)?>)/g,
      deepHtml =
         '<span style="text-decoration: line-through;" data-mce-style="text-decoration: line-through;">text<strong>text<em>text<span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">text</span>text</em>text</strong>text</span>',
      linkHtml =
         '<a class="asLink" rel="noreferrer noopener" href="https://ya.ru" target="_blank">https://ya.ru</a>',
      decoratedLinkHtml =
         '<span class="LinkDecorator__wrap"><a class="LinkDecorator__linkWrap" rel="noreferrer noopener" href="https://ya.ru" target="_blank"><img class="LinkDecorator__image" alt="https://ya.ru" src="/test/?method=LinkDecorator.DecorateSVG&amp;params=eyJMaW5rIjoiaHR0cHM6Ly95YS5ydSJ9&amp;id=0&amp;srv=1" /></a></span>';

   function sortAttrs(html) {
      return html.replace(openTagRegExp, function (match, begin, attrs, end) {
         return begin + (attrs + ' ').split('" ').sort().join('" ') + end;
      });
   }

   function equalsHtml(html1, html2) {
      expect(sortAttrs(html1)).toBe(sortAttrs(html2));
   }

   describe('Controls.markup.Markup.Converter', function () {
      describe('deepCopyJson', function () {
         it('one big', function () {
            var json = [
               ['p', 'text'],
               ['p', deepNode],
               ['p', attributedNode],
               ['p', linkNode],
               ['p', simpleNode]
            ];
            var newJson = decorator.Converter.deepCopyJson(json);
            expect(newJson).not.toBe(json);
            expect(newJson).toEqual(json);
         });
      });

      describe('htmlToJson', function () {
         it('no first tag', function () {
            var html = 'some text without tag <span>and some text in tag</span> dot';
            var json = [[], 'some text without tag ', ['span', 'and some text in tag'], ' dot'];
            expect(decorator.Converter.htmlToJson(html)).toEqual(json);
         });
         it('only text no trim', function () {
            var html = '   some text without tag\t';
            var json = [[], '   some text without tag\t'];
            expect(decorator.Converter.htmlToJson(html)).toEqual(json);
         });
         it('basic', function () {
            var html =
               '<p>text&amp;</p><p>' +
               deepHtml +
               '</p><p><span class="someClass">text</span></p><p>' +
               linkHtml +
               '</p><p><span>text</span></p>';
            var json = [
               ['p', { version: currentVersion }, 'text&'],
               ['p', deepNode],
               ['p', attributedNode],
               ['p', linkNode],
               ['p', simpleNode]
            ];
            expect(decorator.Converter.htmlToJson(html)).toEqual(json);
         });
         it('version', function () {
            expect(decorator.Converter.htmlToJson('<p>No attributes</p>')).toEqual([
               ['p', { version: currentVersion }, 'No attributes']
            ]);
            expect(
               decorator.Converter.htmlToJson('<p style="text-align: center;">With attributes</p>')
            ).toEqual([
               ['p', { version: currentVersion, style: 'text-align: center;' }, 'With attributes']
            ]);
            expect(decorator.Converter.htmlToJson('')).toEqual([]);
            expect(decorator.Converter.htmlToJson('just a string')).toEqual([[], 'just a string']);
         });
         it('trim', function () {
            var html =
               '\n  \n<p>text&amp;</p><p>' +
               deepHtml +
               '</p><p><span class="someClass">text</span></p><p>' +
               linkHtml +
               '</p><p><span>text</span></p>  \n\n\n';
            var json = [
               ['p', { version: currentVersion }, 'text&'],
               ['p', deepNode],
               ['p', attributedNode],
               ['p', linkNode],
               ['p', simpleNode]
            ];
            expect(decorator.Converter.htmlToJson(html)).toEqual(json);
            expect(decorator.Converter.htmlToJson('   \n    \n   ')).toEqual([]);
         });

         it('undecorate link', function () {
            var html = '<p>' + decoratedLinkHtml + '</p>';
            var json = [['p', { version: currentVersion }, linkNode]];
            expect(decorator.Converter.htmlToJson(html)).toEqual(json);
         });

         it('long html', function () {
            var text = 'a'.repeat(2000);
            expect(decorator.Converter.htmlToJson('<p>' + text + '</p>')).toEqual([
               ['p', { version: currentVersion }, text]
            ]);
         }, 1000);
      });

      describe('jsonToHtml', function () {
         var ILogger;
         var errorArray;

         function errorFunction() {
            errorArray.push(arguments);
         }

         beforeAll(function () {
            ILogger = Env.IoC.resolve('ILogger');
            errorArray = [];
         });
         beforeEach(function () {
            decoratedLinkService = Env.constants.decoratedLinkService;
            decoratedLinkHost = Env.constants.decoratedLinkHost;
            Env.constants.decoratedLinkService = '/test/';
            Env.constants.decoratedLinkHost = '';
            jest.spyOn(ILogger, 'error').mockClear().mockImplementation(errorFunction);
         });
         afterEach(function () {
            Env.constants.decoratedLinkService = decoratedLinkService;
            Env.constants.decoratedLinkHost = decoratedLinkHost;
            while (errorArray.length) {
               errorFunction.apply(ILogger, errorArray.shift());
            }
         });
         it('empty', function () {
            equalsHtml(decorator.Converter.jsonToHtml([]), '');
            equalsHtml(decorator.Converter.jsonToHtml(), '');
            equalsHtml(decorator.Converter.jsonToHtml([[], 'some text']), '<div>some text</div>');
         });
         it('only text', function () {
            // TODO: remove case in https://online.sbis.ru/opendoc.html?guid=a8a904f8-6c0d-4754-9e02-d53da7d32c99.
            expect(decorator.Converter.jsonToHtml([''])).toEqual('<div><p></p></div>');
            expect(decorator.Converter.jsonToHtml(['some text'])).toEqual(
               '<div><p>some text</p></div>'
            );
            expect(decorator.Converter.jsonToHtml(['some\ntext'])).toEqual(
               '<div><p>some</p><p>\ntext</p></div>'
            );
            expect(decorator.Converter.jsonToHtml(['p', 'some text'])).toEqual(
               '<div><p>some text</p></div>'
            );
         });
         it('onError attribute', function () {
            var onErrorJson = ['img', { onError: true }];
            var newValidHtml = Object.assign({}, validHtml);
            newValidHtml.validAttributes.onError = true;
            var vdomTemplate = template(
               {
                  _options: {
                     value: onErrorJson,
                     validHtml: newValidHtml,
                     tagResolver: function (node) {
                        if (node[1] && node[1].onError) {
                           node[1].onError = jest.fn();
                        }
                        return node;
                     }
                  }
               },
               {},
               undefined,
               true
            );
            expect(typeof vdomTemplate[0].props.children.props.onError).toBe('function');
         });
         it('string is String class instance', function () {
            // eslint-disable-next-line no-new-wrappers
            var onErrorJson = ['p', new String('String class instance')];
            var newValidHtml = Object.assign({}, validHtml);
            var vdomTemplate = template(
               {
                  _options: {
                     value: onErrorJson,
                     validHtml: newValidHtml
                  }
               },
               {},
               undefined,
               true
            );
            const str = vdomTemplate[0].props.children.props.children;
            const isStringClassInstance = str instanceof String;
            const isPrimitiveString = typeof str === 'string';
            expect(!isStringClassInstance && isPrimitiveString).toBe(true);
         });
         it('escape', function () {
            var json = ['p', { title: '"&lt;<>' }, '&gt;&lt;><&#39;&#'];
            equalsHtml(
               decorator.Converter.jsonToHtml(json),
               '<div><p title="&quot;&amp;lt;&lt;&gt;">&amp;gt;&amp;lt;&gt;&lt;&amp;#39;&amp;#</p></div>'
            );

            // Следующая часть теста бессмысленна под React.
            // Потому что сам React ничего не экранированного не вставляет на страницу.
            // Поэтому тесты для экранирования тут не требуются.
            // Так же нет инферновских структур, которые и тестируются в этих тестах.
            if (UIBase.Control.UNSAFE_isReact !== true) {
               var vdomTemplate = template({ _options: { value: json } }, {}, undefined, true);
               expect(vdomTemplate[0].children[0].children[0].children).toEqual(
                  '&gt;&lt;><&#39;&#'
               );
               expect(vdomTemplate[0].children[0].hprops.attributes.title).toEqual('"&lt;<>');
            }
         });
         it('without escape', () => {
            const json = ['p', { style: 'background: url("source.com/param1=1&param2=2");' }];
            equalsHtml(
               decorator.Converter.jsonToHtml(json),
               '<div><p style="background: url("source.com/param1=1&param2=2");"></p></div>'
            );
         });
         it('one big', function () {
            var json = [
               ['p', 'text&amp;'],
               ['p', deepNode],
               ['p', attributedNode],
               ['p', linkNode],
               ['p', simpleNode]
            ];
            var html =
               '<div><p>text&amp;amp;</p><p>' +
               deepHtml +
               '</p><p><span class="someClass">text</span></p><p>' +
               linkHtml +
               '</p><p><span>text</span></p></div>';
            equalsHtml(decorator.Converter.jsonToHtml(json), html);
         });
         it('no XSS', function () {
            var json = [
                  ['p', ['script', 'alert(123);']],
                  ['p', { onclick: 'alert(123)' }, 'click me'],
                  [
                     'p',
                     [
                        'iframe',
                        {
                           // eslint-disable-next-line no-script-url
                           name: 'javascript:alert(123)',
                           // eslint-disable-next-line no-script-url
                           src: 'javascript:alert(123)',
                           sandbox: 'allow-scripts',
                           style: 'width: 100%; height: 100%;'
                        }
                     ]
                  ],
                  [
                     'p',
                     [
                        'a',
                        {
                           // eslint-disable-next-line no-script-url
                           name: 'javascript:alert(123)',
                           // eslint-disable-next-line no-script-url
                           href: 'javascript:alert(123)'
                        },
                        'xss'
                     ]
                  ],
                  ['p', ['a', { href: '  javascript:alert(123)  ' }, 'leading spaces']],
                  [
                     'p',
                     [
                        'a',
                        // eslint-disable-next-line no-script-url
                        { href: 'jAvAsCrIpT:alert(123)' },
                        'upper and lower case'
                     ]
                  ],
                  [
                     'p',
                     [
                        'iframe',
                        {
                           src: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
                        },
                        'base64 alert'
                     ]
                  ],
                  ['p', ['a', { href: 'tel:+78142332211', rel: 'nofollow' }, '+7(814)-233-22-11']],
                  [
                     'p',
                     [
                        'a',
                        {
                           href: 'viber://pa?chatURI=aliceinsbiswonderland',
                           rel: 'noreferrer noopener',
                           target: '_blank'
                        },
                        'viber://pa?chatURI=aliceinsbiswonderland'
                     ]
                  ]
               ],
               goodHtml =
                  '<div>' +
                  '<p></p>' +
                  '<p>click me</p>' +
                  '<p><iframe class="MarkupDecorator__iframe" name="javascript:alert(123)" sandbox="allow-scripts"></iframe></p>' +
                  '<p><a name="javascript:alert(123)">xss</a></p>' +
                  '<p><a>leading spaces</a></p>' +
                  '<p><a>upper and lower case</a></p>' +
                  '<p><iframe class="MarkupDecorator__iframe">base64 alert</iframe></p>' +
                  '<p><a href="tel:+78142332211" rel="nofollow">+7(814)-233-22-11</a></p>' +
                  '<p><a href="viber://pa?chatURI=aliceinsbiswonderland" rel="noreferrer noopener" target="_blank">viber://pa?chatURI=aliceinsbiswonderland</a></p>' +
                  '</div>',
               checkHtml = decorator.Converter.jsonToHtml(json);
            equalsHtml(checkHtml, goodHtml);
         });

         it('not string attribute', function () {
            var json = [
               [
                  'p',
                  {
                     class: true
                  },
                  'some test'
               ]
            ];
            var goodHtml = '<div><p>some test</p></div>';
            var goodError =
               'Ошибка разбора JsonML: Невалидное значение атрибута class, ожидается строковое значение. Ошибочный узел: {"class":true}';
            var checkHtml = decorator.Converter.jsonToHtml(json);
            var checkError = errorArray.shift()[1];
            equalsHtml(goodHtml, checkHtml);
            expect(checkError.indexOf(goodError) !== -1).toBeTruthy();
         });

         it('invalid JsonML', function () {
            var json = [
               [
                  'p',
                  {
                     class: 'myClass'
                  },
                  {
                     text: 'some text'
                  }
               ]
            ];
            var goodHtml = '<div><p class="myClass"></p></div>';
            var goodError =
               'Ошибка разбора JsonML: Узел в JsonML должен быть строкой или массивом. Ошибочный узел: {"text":"some text"}';
            var checkHtml = decorator.Converter.jsonToHtml(json);
            var checkError = errorArray.shift()[1];
            equalsHtml(goodHtml, checkHtml);
            expect(checkError.indexOf(goodError) !== -1).toBeTruthy();
         });

         it('link to id on current page', function () {
            var json = [
               [
                  'a',
                  {
                     href: '#someId'
                  },
                  'goto'
               ]
            ];
            var goodHtml = '<div><a href="#someId">goto</a></div>';
            var checkHtml = decorator.Converter.jsonToHtml(json);
            expect(goodHtml).toEqual(checkHtml);
         });

         it('all valid tags and attributes', function () {
            var json = [
               [
                  'p',
                  [
                     'html',
                     [
                        'head',
                        ['title', 'Test title'],
                        ['meta', { charset: 'utf-8' }],
                        ['script', 'alert("Test script");'],
                        ['style', '.testStyle { color: red; }']
                     ],
                     [
                        'body',
                        ['div', 'Test division'],
                        ['code', 'Test code'],
                        ['p', 'Test paragraph'],
                        ['span', 'Test span'],
                        [
                           'img',
                           {
                              alt: 'Test image',
                              src: '/test.gif',
                              onclick: 'alert("Test")'
                           }
                        ],
                        ['p', ['img', { src: 'data:image/png;charset=windows-1251;base64,iVBORw0KGgoAAAANS' }]],
                        ['p', ['img', { src: 'data:image/png;base64,iVBORw0KGgoAAAANS' }]],
                        ['br'],
                        ['hamlet', 'Not to be: that is the answer'],
                        ['a', { rel: 'noreferrer noopener', target: '_blank' }, 'Test link'],
                        ['pre', 'Test pretty print'],
                        ['label', 'Test label'],
                        ['font', { color: 'red', face: 'verdana', size: '5' }, 'Test font'],
                        [
                           'blockquote',
                           {
                              cite: 'http://www.worldwildlife.org/who/index.html'
                           },
                           ['div', 'Test block quote']
                        ],
                        [
                           'p',
                           ['b', 'T'],
                           ['strong', 'e'],
                           ['i', 's'],
                           ['em', 't'],
                           ['u', ' '],
                           ['s', 's'],
                           ['strike', 't'],
                           ['q', 'yles']
                        ],
                        [
                           'p',
                           ['h0', 'No!'],
                           ['h1', 'head'],
                           ['h2', 'head'],
                           ['h3', 'head'],
                           ['h4', 'head'],
                           ['h5', 'head'],
                           ['h6', 'head'],
                           ['h7', 'No!']
                        ],
                        [
                           'input',
                           {
                              id: 'testInput',
                              type: 'text',
                              value: 'Test input'
                           }
                        ],
                        [
                           'dl',
                           ['dt', 'Test description list'],
                           ['dd', 'Yes'],
                           ['dt', 'Test filthy language'],
                           ['dd', 'No']
                        ],
                        ['dir', ['li', 'Test'], ['li', 'directed'], ['li', 'titles']],
                        ['ol', ['li', 'Test'], ['li', 'ordered'], ['li', 'list']],
                        ['ul', ['li', 'Test'], ['li', 'unordered'], ['li', 'list']],
                        [
                           'table',
                           ['caption', 'Test table'],
                           [
                              'colgroup',
                              ['col', { style: 'background-color: yellow;' }],
                              ['col', { style: 'background-color: red;' }]
                           ],
                           ['thead', ['tr', ['th', 'Test'], ['th', 'head']]],
                           ['tbody', ['tr', ['td', 'Test'], ['td', 'body']]],
                           ['tfoot', ['tr', ['td', 'Test'], ['td', 'foot']]]
                        ],
                        ['bdi', 'Test bdi'],
                        ['dialog', 'Test dialog'],
                        ['mark', 'Test mark'],
                        ['meter', 'Test meter'],
                        ['progress', 'Test progress'],
                        ['ruby', ['rp', 'Test rp'], ['rt', 'Test rt']],
                        ['details', ['summary', 'Test summary']],
                        ['wbr'],
                        ['datalist', ['option', 'Test option']],
                        ['select', ['option', 'Test option']],
                        ['keygen'],
                        ['output', 'Test output'],
                        ['audio', ['track', { src: '/testAudio.mp3' }]],
                        ['video', ['track', { src: '/testVideo.mp4' }]]
                     ]
                  ]
               ],
               [
                  'p',
                  {
                     alt: 'testAlt',
                     class: 'testClass',
                     colspan: 'testColspan',
                     config: 'testConfig',
                     'data-vdomignore': 'true',
                     'data-random-ovdmxzme': 'testDataTwo',
                     'data-some-id': 'testDataThree',
                     hasmarkup: 'testHasmarkup',
                     height: 'testHeight',
                     href: 'http://www.testHref.com',
                     id: 'testId',
                     name: 'testName',
                     rel: 'testRel',
                     rowspan: 'testRowspan',
                     src: './testSrc',
                     style: 'testStyle',
                     tabindex: 'testTabindex',
                     target: 'testTarget',
                     title: 'testTitle',
                     width: 'testWidth'
                  },
                  'All valid attributes'
               ]
            ];
            var html =
               '<div>' +
               '<p>' +
               '<html>' +
               '<head><title>Test title</title></head>' +
               '<body>' +
               '<div>Test division</div>' +
               '<code>Test code</code>' +
               '<p>Test paragraph</p>' +
               '<span>Test span</span>' +
               '<img alt="Test image" src="/test.gif" />' +
               '<p><img src="data:image/png;charset=windows-1251;base64,iVBORw0KGgoAAAANS" /></p>' +
               '<p><img src="data:image/png;base64,iVBORw0KGgoAAAANS" /></p>' +
               '<br />' +
               '<a rel="noreferrer noopener" target="_blank">Test link</a>' +
               '<pre>Test pretty print</pre>' +
               '<label>Test label</label>' +
               '<font color="red" face="verdana" size="5">Test font</font>' +
               '<blockquote cite="http://www.worldwildlife.org/who/index.html"><div>Test block quote</div></blockquote>' +
               '<p><b>T</b><strong>e</strong><i>s</i><em>t</em><u> </u><s>s</s><strike>t</strike><q>yles</q></p>' +
               '<p><h1>head</h1><h2>head</h2><h3>head</h3><h4>head</h4><h5>head</h5><h6>head</h6></p>' +
               '<input id="testInput" />' +
               '<dl><dt>Test description list</dt><dd>Yes</dd><dt>Test filthy language</dt><dd>No</dd></dl>' +
               '<dir><li>Test</li><li>directed</li><li>titles</li></dir>' +
               '<ol><li>Test</li><li>ordered</li><li>list</li></ol>' +
               '<ul><li>Test</li><li>unordered</li><li>list</li></ul>' +
               '<table>' +
               '<caption>Test table</caption>' +
               '<colgroup><col style="background-color: yellow;" /><col style="background-color: red;" /></colgroup>' +
               '<thead><tr><th>Test</th><th>head</th></tr></thead>' +
               '<tbody><tr><td>Test</td><td>body</td></tr></tbody>' +
               '<tfoot><tr><td>Test</td><td>foot</td></tr></tfoot>' +
               '</table>' +
               '<bdi>Test bdi</bdi>' +
               '<dialog>Test dialog</dialog>' +
               '<mark>Test mark</mark>' +
               '<meter>Test meter</meter>' +
               '<progress>Test progress</progress>' +
               '<ruby><rp>Test rp</rp><rt>Test rt</rt></ruby>' +
               '<details><summary>Test summary</summary></details>' +
               '<wbr />' +
               '<datalist><option>Test option</option></datalist>' +
               '<select><option>Test option</option></select>' +
               '<keygen />' +
               '<output>Test output</output>' +
               '<audio><track src="/testAudio.mp3" /></audio>' +
               '<video><track src="/testVideo.mp4" /></video>' +
               '</body>' +
               '</html>' +
               '</p>' +
               '<p alt="testAlt" class="testClass" colspan="testColspan" config="testConfig" data-vdomignore="true" data-random-ovdmxzme="testDataTwo" data-some-id="testDataThree" hasmarkup="testHasmarkup" height="testHeight" href="http://www.testHref.com" id="testId" name="testName" rel="testRel" rowspan="testRowspan" src="./testSrc" style="testStyle" tabindex="testTabindex" target="testTarget" title="testTitle" width="testWidth">All valid attributes</p>' +
               '</div>';
            equalsHtml(decorator.Converter.jsonToHtml(json), html);
         });

         it('valid href - 1', function () {
            var json = [['a', { href: 'https://www.google.com/' }]],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><a href="https://www.google.com/"></a></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('valid href - 2', function () {
            var json = [['a', { href: 'hTtPs://www.google.com/' }]],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><a href="hTtPs://www.google.com/"></a></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('valid href - 3', function () {
            var json = [['a', { href: '/resources/some.html' }]],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><a href="/resources/some.html"></a></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('valid href - 4', function () {
            var json = [['a', { href: './resources/some.html' }]],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><a href="./resources/some.html"></a></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('invalid href - 1', function () {
            var json = [['a', { href: 'www.google.com' }]],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><a></a></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('invalid href - 2', function () {
            var json = [
                  // eslint-disable-next-line no-script-url
                  ['a', { href: 'javascript:alert(123)' }]
               ],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><a></a></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('invalid href - 3', function () {
            var json = [['a', { href: 'www.http.log.ru' }]],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><a></a></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('validate data- attributes - 1', function () {
            var json = [['p', { 'data-': 'value' }, 'text']],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><p>text</p></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('validate data- attributes - 2', function () {
            var json = [['p', { 'data-ewghierg': 'value' }, 'text']],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><p data-ewghierg="value">text</p></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('validate data- attributes - 3', function () {
            var json = [['p', { 'data-component': 'value' }, 'text']],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><p>text</p></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('validate data- attributes - 4', function () {
            var json = [['p', { 'data-component-style': 'value' }, 'text']],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><p data-component-style="value">text</p></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('validate data- attributes - 5', function () {
            var json = [['p', { 'data-key-': 'value' }, 'text']],
               checkHtml = decorator.Converter.jsonToHtml(json),
               goodHtml = '<div><p>text</p></div>';
            equalsHtml(checkHtml, goodHtml);
         });

         it('validHtml option', function () {
            var // eslint-disable-next-line no-shadow
               validHtml = {
                  validNodes: {
                     any: true,
                     tag: true,
                     link: true,
                     additional: {
                        add: true
                     },
                     script: true
                  },
                  validAttributes: {
                     name: true,
                     value: true
                  }
               },
               json = [
                  ['p', '123'],
                  ['div', '456'],
                  ['any', { name: 'name', value: 'value', id: 'id' }],
                  ['tag', 'inner text'],
                  ['link'],
                  ['additional', { add: 'add', name: 'name', id: 'id' }],
                  ['script', 'alert(123);']
               ],
               goodHtml =
                  '<any name="name" value="value"></any>' +
                  '<tag>inner text</tag>' +
                  '<link />' +
                  '<additional add="add" name="name"></additional>' +
                  '<script>alert(123);</script>',
               checkHtml = template(
                  {
                     _options: {
                        value: json,
                        validHtml: validHtml,
                        tagResolver: decorator.noOuterTag
                     }
                  },
                  {}
               );
            equalsHtml(checkHtml, goodHtml);
         });

         it('with linkDecorate resolver', function () {
            // Link with length 1500.
            var longLink = 'https://ya.ru/' + 'a'.repeat(1486);
            var json = [
               ['p', linkNode],
               ['pre', linkNode],
               ['div', linkNode],
               ['p', linkNode, nbsp + nbsp + '   '],
               ['p', linkNode, '   ', decorator.Converter.deepCopyJson(linkNode)],
               ['p', linkNode, 'text '],
               ['pre', 'https://ya.ru\ntext'],
               ['p', linkNode, ['br'], 'text'],
               ['p', linkNode, '   ', ['br'], 'text'],
               ['p', ['strong', linkNode], 'text'],
               [
                  'p',
                  [
                     'a',
                     {
                        rel: 'noreferrer noopener',
                        href: 'https:\\\\ya.ru\\som"e'
                     },
                     'https:\\\\ya.ru\\som"e'
                  ]
               ],
               [
                  'p',
                  'outer text one',
                  ['br'],
                  'outer text two',
                  ['p', 'inner text'],
                  'outer text three'
               ],
               ['p', ['a', { href: longLink }, longLink]],
               ['p', ['a', { href: 'https://ya.ru' }, 'text']]
            ];
            var htmlArray = [
               '<p>' + decoratedLinkHtml + '</p>',
               '<pre>' + decoratedLinkHtml + '</pre>',
               '<div>' + decoratedLinkHtml + '</div>',
               '<p>' + decoratedLinkHtml + '&nbsp;&nbsp;   </p>',
               '<p>' + decoratedLinkHtml + '   ' + decoratedLinkHtml + '</p>',
               '<p>' + linkHtml + 'text </p>',
               '<pre>' + decoratedLinkHtml + '\ntext</pre>',
               '<p>' + decoratedLinkHtml + '<br />text</p>',
               '<p>' + decoratedLinkHtml + '   <br />text</p>',
               '<p><strong>' + linkHtml + '</strong>text</p>',
               '<p><span class="LinkDecorator__wrap"><a class="LinkDecorator__linkWrap" rel="noreferrer noopener" href="https:\\\\ya.ru\\som&quot;e" target="_blank"><img class="LinkDecorator__image" alt="https:\\\\ya.ru\\som&quot;e" src="/test/?method=LinkDecorator.DecorateSVG&amp;params=eyJMaW5rIjoiaHR0cHM6XFxcXHlhLnJ1XFxzb21cImUifQ%3D%3D&amp;id=0&amp;srv=1" /></a></span></p>',
               '<p>outer text one<br />outer text two<p>inner text</p>outer text three</p>',
               '<p><a href="' + longLink + '">' + longLink + '</a></p>',
               '<p><a href="https://ya.ru">text</a></p>'
            ];
            for (var i = 0; i < json.length; ++i) {
               var checkHtml = decorator.Converter.jsonToHtml(json[i], decorator.linkDecorate);
               var goodHtml = '<div>' + htmlArray[i] + '</div>';
               equalsHtml(checkHtml, goodHtml, 'fail in index ' + i);
            }
         });

         it('with highlight resolver', function () {
            var json = [
               ['p', ['strong', 'BaBare;gjwergo'], 'aBaweruigerhw', ['em', 'aBa']],
               ['p', 'aba, abA, aBa, aBA, Aba, AbA, ABa, ABA'],
               ['p', 'abababababa'],
               ['p', 'no highlight']
            ];
            var html =
               '<div>' +
               '<p><strong>B<span class="controls-MarkupDecorator_highlight">aBa</span>re;gjwergo</strong><span class="controls-MarkupDecorator_highlight">aBa</span>weruigerhw<em><span class="controls-MarkupDecorator_highlight">aBa</span></em></p>' +
               '<p><span class="controls-MarkupDecorator_highlight">aba</span>, <span class="controls-MarkupDecorator_highlight">abA</span>, <span class="controls-MarkupDecorator_highlight">aBa</span>, <span class="controls-MarkupDecorator_highlight">aBA</span>, <span class="controls-MarkupDecorator_highlight">Aba</span>, <span class="controls-MarkupDecorator_highlight">AbA</span>, <span class="controls-MarkupDecorator_highlight">ABa</span>, <span class="controls-MarkupDecorator_highlight">ABA</span></p>' +
               '<p><span class="controls-MarkupDecorator_highlight">aba</span>b<span class="controls-MarkupDecorator_highlight">aba</span>b<span class="controls-MarkupDecorator_highlight">aba</span></p>' +
               '<p>no highlight</p>' +
               '</div>';
            equalsHtml(
               decorator.Converter.jsonToHtml(json, decorator._highlightResolver, {
                  textToHighlight: 'aBa'
               }),
               html
            );
         });
         it('with innerText resolver', function () {
            var json = [
               ['p', 'text&amp;', ['br'], 'more text'],
               ['p', deepNode],
               ['p'],
               ['p', attributedNode],
               ['p', linkNode],
               ['p', simpleNode],
               ['h1', 'header']
            ];
            expect(decorator.Converter.jsonToHtml(json, decorator.InnerText)).toEqual(
               'text&amp;\nmore text\ntexttexttexttexttexttexttext\n\ntext\nhttps://ya.ru\ntext\nheader\n'
            );
         });
         it('with noOuterTag resolver', function () {
            var json = [
               ['p', 'text&amp;'],
               ['p', deepNode],
               ['p', attributedNode],
               ['p', linkNode],
               ['p', simpleNode]
            ];
            var html =
               '<p>text&amp;amp;</p><p>' +
               deepHtml +
               '</p><p><span class="someClass">text</span></p><p>' +
               linkHtml +
               '</p><p><span>text</span></p>';
            equalsHtml(decorator.Converter.jsonToHtml(json, decorator.noOuterTag), html);
            expect(decorator.Converter.jsonToHtml([], decorator.noOuterTag)).toEqual('');
         });

         it('with linkWrap resolver', function () {
            var json = [
               ['p', linkNode],
               ['p', 'https://ya.ru'],
               ['p', 'just text']
            ];
            var htmlArray = [
               '<p>' + linkHtml + '</p>',
               '<p>' + linkHtml + '</p>',
               '<p>just text</p>'
            ];
            for (var i = 0; i < json.length; ++i) {
               var checkHtml = decorator.Converter.jsonToHtml(json[i], decorator.linkWrapResolver);
               var goodHtml = '<div>' + htmlArray[i] + '</div>';
               equalsHtml(checkHtml, goodHtml, 'fail in index ' + i);
            }
         });
         it('case sensitivity (lower)', function () {
            var json = [['svg', { viewbox: '0 0 100 100' }]];
            var goodHtml = '<div><svg viewbox="0 0 100 100"></svg></div>';
            var checkHtml = decorator.Converter.jsonToHtml(json);
            equalsHtml(checkHtml, goodHtml);
         });
         it('case sensitivity (camel)', function () {
            var json = [['svg', { viewBox: '0 0 100 100' }]];
            var goodHtml = '<div><svg viewbox="0 0 100 100"></svg></div>';
            var checkHtml = decorator.Converter.jsonToHtml(json);
            equalsHtml(checkHtml, goodHtml);
         });

         describe('component:', function() {
            it('Валидный компонент', () => {
               var json = [['component:LinkDecorator/view:Link', {href: 'https://google.com'}]];
               var vdomTemplate = template({ _options: { value: json } }, {}, undefined, true);
               expect(vdomTemplate[0].props.children.props.moduleName).toEqual('Link');
            });

            it('Невалидный компонент', () => {
               var json = [['component:Controls/markup:Decorator']];
               var vdomTemplate = template({ _options: { value: json } }, {}, undefined, true);
               expect(vdomTemplate[0].props.children).toBeUndefined();
            });
         });

         describe('emojies', function () {
            it('Простые эмодзи внутри одной текстовой ноды', function () {
               var json = [['p', '😀😀1😃2😄3🏃‍♀️']];

               var vdomTemplate = template({ _options: { value: json } }, {}, undefined, true);

               const children = vdomTemplate[0].props.children.props.children;
               expect(children[0].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😀'
               });
               expect(children[1].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😀'
               });
               expect(children[2].props).toEqual({
                  children: '1'
               });
               expect(children[3].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😃'
               });
               expect(children[4].props).toEqual({
                  children: '2'
               });
               expect(children[5].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😄'
               });
               expect(children[6].props).toEqual({
                  children: '3'
               });
               expect(children[7].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '🏃‍♀️'
               });
            });

            it('Простые эмодзи в разных текстовых нодах', function () {
               var json = [['p', '😀😀', '😃', '😄']];

               var vdomTemplate = template({ _options: { value: json } }, {}, undefined, true);

               const children = vdomTemplate[0].props.children.props.children;
               expect(children[0].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😀'
               });
               expect(children[1].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😀'
               });
               expect(children[2].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😃'
               });
               expect(children[3].props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😄'
               });
            });

            it('Эмодзи с символами нулевой ширины', function () {
               var json = [['p', '😀\uFE0F\uFE0F\uFE0F']];

               var vdomTemplate = template({ _options: { value: json } }, {}, undefined, true);

               const children = vdomTemplate[0].props.children.props.children;
               expect(children.props).toEqual({
                  className: 'LinkDecorator__emoji richEditor_Base-RichEditor__noneditable',
                  children: '😀'
               });
            });

            it('Эмодзи и tagResolver', function () {
               var json = [['p', '😀😀1😃2😄3']];
               var vdomTemplate = template(
                  {
                     _options: { value: json, tagResolver: decorator.InnerText }
                  },
                  {},
                  undefined,
                  true
               );
               expect(vdomTemplate[0]).toEqual('😀😀1😃2😄3\n');
            });

            it('Эмодзи, декорированная ссылка и tagResolver', function () {
               const json = ['div', [['p', '😀https://online.sbis.ru/']]];
               const result = template(
                  {
                     _options: {
                        value: json,
                        tagResolver: decorator.linkDecorate
                     }
                  },
                  {}
               );
               const expectedResult =
                  '<div><div><p><span class="LinkDecorator__emoji richEditor_Base-RichEditor__noneditable">😀</span><span><span class="LinkDecorator__wrap"><a href="https://online.sbis.ru/" class="LinkDecorator__linkWrap" target="_blank" rel="noreferrer noopener">';
               expect(result).toMatch(expectedResult);
            });
         });
      });
   });

   describe('Controls.markup.Markup.resources.linkDecorateUtils', function () {
      describe('isDecoratedLink', function () {
         it('decorated link node', function () {
            expect(linkDecorateUtils.isDecoratedLink('span', decoratedLinkFirstChildNode)).toBe(
               true
            );
         });

         it('decorated link node two classes', function () {
            var decoratedLinkFirstChildNodeCopy = decorator.Converter.deepCopyJson(
               decoratedLinkFirstChildNode
            );
            decoratedLinkFirstChildNodeCopy[1].class += ' anotherClass';
            expect(
               linkDecorateUtils.isDecoratedLink('span', decoratedLinkFirstChildNodeCopy)
            ).toBeTruthy();
         });

         it('decorated link node no classes', function () {
            var decoratedLinkFirstChildNodeCopy = decorator.Converter.deepCopyJson(
               decoratedLinkFirstChildNode
            );
            delete decoratedLinkFirstChildNodeCopy[1].class;
            expect(
               linkDecorateUtils.isDecoratedLink('span', decoratedLinkFirstChildNodeCopy)
            ).toBeFalsy();
         });

         it('wrong tag name', function () {
            expect(linkDecorateUtils.isDecoratedLink('div', decoratedLinkFirstChildNode)).toBe(
               false
            );
            expect(linkDecorateUtils.isDecoratedLink('', decoratedLinkFirstChildNode)).toBe(false);
         });
         it('have not first child', function () {
            expect(linkDecorateUtils.isDecoratedLink('span')).toBe(false);
            expect(linkDecorateUtils.isDecoratedLink('span', null)).toBe(false);
            expect(linkDecorateUtils.isDecoratedLink('span', [])).toBe(false);
            expect(linkDecorateUtils.isDecoratedLink('span', '')).toBe(false);
         });
         it('wrong class name first child', function () {
            expect(
               linkDecorateUtils.isDecoratedLink('span', [
                  'a',
                  {
                     href: 'https://ya.ru',
                     target: '_blank',
                     class: 'LinkDecorator__linkWrapOrNotLinkWrap'
                  },
                  [
                     'img',
                     {
                        class: 'LinkDecorator__image',
                        alt: 'https://ya.ru'
                     }
                  ]
               ])
            ).toBe(false);
         });
         it('wrong have not href first child', function () {
            expect(
               linkDecorateUtils.isDecoratedLink('span', [
                  'a',
                  {
                     target: '_blank',
                     class: 'LinkDecorator__linkWrap'
                  },
                  [
                     'img',
                     {
                        class: 'LinkDecorator__image',
                        alt: 'https://ya.ru'
                     }
                  ]
               ])
            ).toBe(false);
         });
      });
      describe('getUndecoratedLink', function () {
         it('undecorate a decorated link', function () {
            expect(linkDecorateUtils.getUndecoratedLink(decoratedLinkFirstChildNode)).toEqual(
               linkNode
            );
         });
      });

      describe('wrapLinksInString', function () {
         it('correct link on local file - 1', () => {
            var parentNode = ['p', 'C:\\test'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\test'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('correct link on local file - 2', () => {
            var parentNode = ['p', 'C:\\\\test'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\\\test',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\\\test'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('correct link on local file - 3', () => {
            var parentNode = ['p', 'C:\\test.html'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test.html',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\test.html'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('correct link on local file - 4', () => {
            var parentNode = ['p', 'C:\\\\test\\hello.html'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\\\test\\hello.html',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\\\test\\hello.html'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('correct link on local file - 5', () => {
            var parentNode = ['p', 'C:\\test\\hello.html'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test\\hello.html',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\test\\hello.html'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('correct link on local file - 6', () => {
            var parentNode = ['p', '\\\\test'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': '\\\\test',
                     href: '',
                     target: '_blank'
                  },
                  '\\\\test'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('correct link on local file - 7', () => {
            var parentNode = ['p', '\\\\test\\hello.txt'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': '\\\\test\\hello.txt',
                     href: '',
                     target: '_blank'
                  },
                  '\\\\test\\hello.txt'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('correct link on local file - 8', () => {
            var parentNode = ['p', 'C:\\test\\test-test.txt'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test\\test-test.txt',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\test\\test-test.txt'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('link in quotes', () => {
            /* eslint-disable-next-line no-useless-escape */
            var parentNode = ['p', '"C:\\test"'];
            /* eslint-disable-next-line no-useless-escape */
            var goodResultNode = [
               [],
               '"',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test',
                     href: '',
                     target: '_blank'
                     /* eslint-disable-next-line no-useless-escape */
                  },
                  'C:\\test'
               ],
               '"'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('link in quotes with spaces', () => {
            /* eslint-disable-next-line no-useless-escape */
            var parentNode = ['p', '"C:\\test test\\test test"'];
            /* eslint-disable-next-line no-useless-escape */
            var goodResultNode = [
               [],
               '"',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test test\\test test',
                     href: '',
                     target: '_blank'
                     /* eslint-disable-next-line no-useless-escape */
                  },
                  'C:\\test test\\test test'
               ],
               '"'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('several links in quotes with spaces', () => {
            /* eslint-disable-next-line no-useless-escape */
            var parentNode = [
               'p',
               'some text C:\\test "C:\\test test\\test test" "C:\\test test" some text "C:\\test"'
            ];
            var goodResultNode = [
               [],
               'some text ',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test',
                     href: '',
                     target: '_blank'
                     /* eslint-disable-next-line no-useless-escape */
                  },
                  'C:\\test'
               ],
               ' "',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test test\\test test',
                     href: '',
                     target: '_blank'
                     /* eslint-disable-next-line no-useless-escape */
                  },
                  'C:\\test test\\test test'
               ],
               '" "',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test test',
                     href: '',
                     target: '_blank'
                     /* eslint-disable-next-line no-useless-escape */
                  },
                  'C:\\test test'
               ],
               '" some text "',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test',
                     href: '',
                     target: '_blank'
                     /* eslint-disable-next-line no-useless-escape */
                  },
                  'C:\\test'
               ],
               '"'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('link without closing quote', () => {
            /* eslint-disable-next-line no-useless-escape */
            var parentNode = ['p', '"C:\\test test'];
            /* eslint-disable-next-line no-useless-escape */
            var goodResultNode = [
               [],
               '"',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\test'
               ],
               ' test'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('incorrect link - 1', () => {
            var parentNode = ['p', '\\test'];
            var goodResultNode = '\\test';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('incorrect link - 2', () => {
            var parentNode = ['p', '\\test\\html'];
            var goodResultNode = '\\test\\html';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('incorrect link - 3', () => {
            var parentNode = ['p', '\\test.html'];
            var goodResultNode = '\\test.html';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('incorrect link - 4', () => {
            var parentNode = ['p', '\\10.1.1.107'];
            var goodResultNode = '\\10.1.1.107';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('incorrect link - 5 ', () => {
            var parentNode = ['p', '\\10.1.1.107\\test.html'];
            var goodResultNode = '\\10.1.1.107\\test.html';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('incorrect link - 6', () => {
            var parentNode = ['p', '\\10.1.1.107\\test\\hello'];
            var goodResultNode = '\\10.1.1.107\\test\\hello';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('link contains incorrect symbols', () => {
            var parentNode = ['p', 'C:\\te<st.html C:\\te?st'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\te',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\te'
               ],
               '<st.html ',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\te',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\te'
               ],
               '?st'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('no link', () => {
            var parentNode = ['p', '\test test /test'];
            var goodResultNode = '\test test /test';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('multiple links', () => {
            var parentNode = ['p', 'C:\\test.html text C:\\test\\hello.html text'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test.html',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\test.html'
               ],
               ' text ',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'C:\\test\\hello.html',
                     href: '',
                     target: '_blank'
                  },
                  'C:\\test\\hello.html'
               ],
               ' text'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with protocol - 1', function () {
            var parentNode = ['p', 'https://ya.ru'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('long link', () => {
            const goodStr = 'https://ya.ru/' + 'a'.repeat(8192);
            const parentNode = ['p', goodStr];
            const checkStr = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodStr).toEqual(checkStr);
         });

         it('with protocol - 2', function () {
            var parentNode = ['p', 'http://localhost:1025'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://localhost:1025',
                     target: '_blank'
                  },
                  'http://localhost:1025'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with protocol - 3', function () {
            var parentNode = ['p', 'http:\\\\localhost:1025'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http:\\\\localhost:1025',
                     target: '_blank'
                  },
                  'http:\\\\localhost:1025'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with protocol - 4', function () {
            var parentNode = ['p', 'https://'];
            var goodResultNode = 'https://';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with protocol - 5', function () {
            var parentNode = ['p', 'http:\\localhost:1025'];
            var goodResultNode = [
               [],
               'htt',
               [
                  'a',
                  {
                     class: 'asLink',
                     'data-open-file': 'p:\\localhost',
                     href: '',
                     target: '_blank'
                  },
                  'p:\\localhost'
               ],
               ':1025'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with unlinked attribute', function () {
            var parentNode = ['p', { 'data-richeditor-unlinked': 'true' }, 'https://ya.ru/'];
            var goodResultNode = 'https://ya.ru/';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[2], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with multiple ?', function () {
            var parentNode = [
               'p',
               'https://www.google.com/search?test?&source=lmns&bih=937&biw=192'
            ];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://www.google.com/search?test?&source=lmns&bih=937&biw=192',
                     target: '_blank'
                  },
                  'https://www.google.com/search?test?&source=lmns&bih=937&biw=192'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with protocol in brackets', function () {
            var parentNode = ['p', '(http://localhost:1025)'];
            var goodResultNode = [
               [],
               '(',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://localhost:1025',
                     target: '_blank'
                  },
                  'http://localhost:1025'
               ],
               ')'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with protocol with capital letters', function () {
            var parentNode = ['p', 'HtTpS://ya.ru'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'HtTpS://ya.ru',
                     target: '_blank'
                  },
                  'HtTpS://ya.ru'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with bracket after protocol', function () {
            var parentNode = ['p', 'http://{localhost:1025}/'];
            var goodResultNode = 'http://{localhost:1025}/';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with emoji and protocol', function () {
            var parentNode = ['p', 'https://ya.ru/😊'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru/',
                     target: '_blank'
                  },
                  'https://ya.ru/'
               ],
               '😊'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with emoji and without protocol', function () {
            var parentNode = ['p', 'vk.com/😊'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://vk.com/',
                     target: '_blank'
                  },
                  'vk.com/'
               ],
               '😊'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('with \\n characters', function () {
            var parentNode = ['p', 'https://ya.ru\nsome\ntext'];
            var goodResultNode = [[], linkNode, '\nsome\ntext'];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol - 1', function () {
            var parentNode = [
               'p',
               'usd-comp162.corp.tensor.ru:1025/?grep=Controls%5C.Decorator%5C.Markup'
            ];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://usd-comp162.corp.tensor.ru:1025/?grep=Controls%5C.Decorator%5C.Markup',
                     target: '_blank'
                  },
                  'usd-comp162.corp.tensor.ru:1025/?grep=Controls%5C.Decorator%5C.Markup'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol - 2', function () {
            var parentNode = ['p', 'vk.com'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://vk.com',
                     target: '_blank'
                  },
                  'vk.com'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol - 3', function () {
            var parentNode = ['p', 'market.yandex.ru'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://market.yandex.ru',
                     target: '_blank'
                  },
                  'market.yandex.ru'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol - 4', function () {
            var parentNode = ['p', 'my page on vk.com is vk.com/id0'];
            var goodResultNode = [
               [],
               'my page on ',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://vk.com',
                     target: '_blank'
                  },
                  'vk.com'
               ],
               ' is ',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://vk.com/id0',
                     target: '_blank'
                  },
                  'vk.com/id0'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol - 5', function () {
            var parentNode = ['p', 'yandex.ru.'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://yandex.ru',
                     target: '_blank'
                  },
                  'yandex.ru'
               ],
               '.'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol - 6', function () {
            var parentNode = ['p', 'www.google.com'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://www.google.com',
                     target: '_blank'
                  },
                  'www.google.com'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol in brackets', function () {
            var parentNode = ['p', '(www.google.com)'];
            var goodResultNode = [
               [],
               '(',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://www.google.com',
                     target: '_blank'
                  },
                  'www.google.com'
               ],
               ')'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol wrong top level domain name - 1', function () {
            var parentNode = ['p', 'www.google.comma'];
            var goodResultNode = 'www.google.comma';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol wrong top level domain name - 2', function () {
            var parentNode = ['p', 'vk.comma/id0'];
            var goodResultNode = 'vk.comma/id0';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('without protocol wrong top level domain name - 3', function () {
            var parentNode = [
               'p',
               'usd-comp162.corp.tensor.ur:1025/?grep=Controls%5C.Decorator%5C.Markup'
            ];
            var goodResultNode =
               'usd-comp162.corp.tensor.ur:1025/?grep=Controls%5C.Decorator%5C.Markup';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('inside link', function () {
            var parentNode = ['a', 'https://ya.ru'];
            var goodResultNode = 'https://ya.ru';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('link with brackets', function () {
            var parentNode = [
               'p',
               'http://ci-fix-autotests.sbis.ru/job/(%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%BE%D1%87%D0%BD%D1%8B%D0%B5)%20fix-online-ext-autotest/job/(B%D0%B5)%20/'
            ];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://ci-fix-autotests.sbis.ru/job/(%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%BE%D1%87%D0%BD%D1%8B%D0%B5)%20fix-online-ext-autotest/job/(B%D0%B5)%20/',
                     target: '_blank'
                  },
                  'http://ci-fix-autotests.sbis.ru/job/(%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%BE%D1%87%D0%BD%D1%8B%D0%B5)%20fix-online-ext-autotest/job/(B%D0%B5)%20/'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('email - 1', function () {
            var parentNode = ['p', 'sm.body@tensor.ru'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     href: 'mailto:sm.body@tensor.ru'
                  },
                  'sm.body@tensor.ru'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('email - 2', function () {
            var parentNode = ['p', 'rweghjrewefij.rwe.gareg.123.32423.fswef@mail.ru'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     href: 'mailto:rweghjrewefij.rwe.gareg.123.32423.fswef@mail.ru'
                  },
                  'rweghjrewefij.rwe.gareg.123.32423.fswef@mail.ru'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('email in brackets', function () {
            var parentNode = ['p', 'text(sm.body@tensor.ru)text'];
            var goodResultNode = [
               [],
               'text(',
               [
                  'a',
                  {
                     href: 'mailto:sm.body@tensor.ru'
                  },
                  'sm.body@tensor.ru'
               ],
               ')text'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('email with wrong domain', function () {
            var parentNode = ['p', 'sm.body@tensor.rux'];
            var goodResultNode = 'sm.body@tensor.rux';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('email with an emoji', function () {
            var parentNode = ['p', 'sm.body@tensor😊.ru'];
            var goodResultNode = 'sm.body@tensor😊.ru';
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('email ending with quote mark', function () {
            var parentNode = ['p', '"Email": "test@mail.ru"'];
            var goodResultNode = [
               [],
               '"Email": "',
               [
                  'a',
                  {
                     href: 'mailto:test@mail.ru'
                  },
                  'test@mail.ru'
               ],
               '"'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1]);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('link ending with quote mark', function () {
            var parentNode = ['p', '"Link": "www.google.com"'];
            var goodResultNode = [
               [],
               '"Link": "',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://www.google.com',
                     target: '_blank'
                  },
                  'www.google.com'
               ],
               '"'
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1]);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('Ссылка на кириллице с протоколом', function () {
            var parentNode = ['p', 'https://налог.рф'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://налог.рф',
                     target: '_blank'
                  },
                  'https://налог.рф'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('Ссылка на кириллице без протокола', () => {
            var parentNode = ['p', 'налог.рф'];
            var goodResultNode = [
               [],
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://налог.рф',
                     target: '_blank'
                  },
                  'налог.рф'
               ]
            ];
            var checkResultNode = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(goodResultNode).toEqual(checkResultNode);
         });

         it('Скобка в конце ссылки является частью ссылки', () => {
            const parentNode = [
               'p',
               'Ссылка: https://fr.wikipedia.org/wiki/Observateur_(patron_de_conception)'
            ];
            const correctResult = [
               [],
               'Ссылка: ',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://fr.wikipedia.org/wiki/Observateur_(patron_de_conception)',
                     target: '_blank'
                  },
                  'https://fr.wikipedia.org/wiki/Observateur_(patron_de_conception)'
               ]
            ];
            const result = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(result).toEqual(correctResult);
         });

         it('Скобка в конце ссылки не является частью ссылки', () => {
            const parentNode = ['p', 'Ссылка (https://music.yandex.ru)'];
            const correctResult = [
               [],
               'Ссылка (',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://music.yandex.ru',
                     target: '_blank'
                  },
                  'https://music.yandex.ru'
               ],
               ')'
            ];
            const result = linkDecorateUtils.wrapLinksInString(parentNode[1], parentNode);
            expect(result).toEqual(correctResult);
         });
      });

      describe('removeHrefAfterExtraBracket', () => {
         it('Скобка в конце ссылки является частью ссылки', () => {
            const link = {
               href: 'https://fr.wikipedia.org/wiki/Observateur_(patron_de_conception)',
               text: 'https://fr.wikipedia.org/wiki/Observateur_(patron_de_conception)',
               position: 0
            };
            const result = linkDecorateUtils.removeHrefAfterExtraBracket(link, true);
            expect(result).toEqual([link, '']);
         });

         it('Скобка в конце ссылки не является частью ссылки', () => {
            const link = {
               href: 'https://music.yandex.ru)',
               text: 'https://music.yandex.ru)',
               position: 0
            };
            const result = linkDecorateUtils.removeHrefAfterExtraBracket(link, true);
            const correctLink = {
               href: 'https://music.yandex.ru',
               text: 'https://music.yandex.ru',
               position: 0
            };
            const extraBracket = ')';
            expect(result).toEqual([correctLink, extraBracket]);
         });

         it('Сломанная ссылка со скобкой в середине ссылки', () => {
            const link = {
               href: 'https://music.ya]ndex.ru',
               text: 'https://music.ya]ndex.ru',
               position: 0
            };
            const result = linkDecorateUtils.removeHrefAfterExtraBracket(link, true);
            const correctLink = {
               href: 'https://music.ya',
               text: 'https://music.ya',
               position: 0
            };
            const textAfterExtraBracket = ']ndex.ru';
            expect(result).toEqual([correctLink, textAfterExtraBracket]);
         });

         it('В ссылке нет скобок', () => {
            const link = {
               href: 'https://music.yandex.ru',
               text: 'https://music.yandex.ru',
               position: 0
            };
            const result = linkDecorateUtils.removeHrefAfterExtraBracket(link, true);
            expect(result).toEqual([link, '']);
         });
      });

      describe('getLinks', function () {
         it('with protocol - 1', function () {
            var str = 'https://ya.ru';
            var result = ['https://ya.ru'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('long link', () => {
            const str = 'https://ya.ru/' + 'a'.repeat(100);
            const result = [str];
            const checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('with protocol - 2', function () {
            var str = 'http://localhost:1025';
            const result = [str];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('with protocol - 3', function () {
            var str = 'http:\\\\localhost:1025';
            var result = ['http:\\\\localhost:1025'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('with protocol - 4', function () {
            var str = 'https://';
            var result = [];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('with protocol - 5', function () {
            var str = 'http:\\localhost:1025';
            var result = [];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('with protocol in brackets', function () {
            var str = '(http://localhost:1025)';
            var result = ['http://localhost:1025'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('with protocol with capital letters', function () {
            var str = 'HtTpS://ya.ru';
            var result = ['HtTpS://ya.ru'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('with emoji and protocol', function () {
            var str = ['p', 'https://ya.ru/😊'];
            var result = ['https://ya.ru/'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('with emoji and without protocol', function () {
            var str = 'vk.com/😊';
            var result = ['http://vk.com/'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol - 1', function () {
            var str = 'usd-comp162.corp.tensor.ru:1025/?grep=Controls%5C.Decorator%5C.Markup';
            var result = [
               'http://usd-comp162.corp.tensor.ru:1025/?grep=Controls%5C.Decorator%5C.Markup'
            ];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol - 2', function () {
            var str = 'vk.com';
            var result = ['http://vk.com'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol - 3', function () {
            var str = 'market.yandex.ru';
            var result = ['http://market.yandex.ru'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol - 4, get multiple links', function () {
            var str = 'my page on vk.com is vk.com/id0';
            var result = ['http://vk.com', 'http://vk.com/id0'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol - 5', function () {
            var str = 'yandex.ru.';
            var result = ['http://yandex.ru'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol - 6', function () {
            var str = 'www.google.com';
            var result = ['http://www.google.com'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol in brackets', function () {
            var str = '(www.google.com)';
            var result = ['http://www.google.com'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol wrong top level domain name - 1', function () {
            var str = 'www.google.comma';
            var result = [];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol wrong top level domain name - 2', function () {
            var str = 'vk.comma/id0';
            var result = [];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('without protocol wrong top level domain name - 3', function () {
            var str = 'usd-comp162.corp.tensor.ur:1025/?grep=Controls%5C.Decorator%5C.Markup';
            var result = [];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('email - 1', function () {
            var str = 'sm.body@tensor.ru';
            var result = [];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('email - 2', function () {
            var str = 'rweghjrewefij.rwe.gareg.123.32423.fswef@mail.ru';
            var result = [];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });

         it('wrapped in <>', function () {
            var str = '<https://google.com>';
            var result = ['https://google.com'];
            var checkResultNode = linkDecorateUtils.getLinks(str);
            expect(result).toEqual(checkResultNode);
         });
      });

      describe('normalizeLink', function () {
         var protocolNames = [
            'http:(?://|\\\\\\\\)',
            'https:(?://|\\\\\\\\)',
            'ftp:(?://|\\\\\\\\)',
            'file:(?://|\\\\\\\\)',
            'smb:(?://|\\\\\\\\)'
         ];
         var protocolLinkPrefixPattern = `(?:${protocolNames.join('|')})`.replace(/[a-z]/g, (m) => {
            return `[${m + m.toUpperCase()}]`;
         });
         var simpleLinkPrefixPattern =
            '([\\w\\-]{1,500}(?:\\.[a-zA-Z]{1,500}){0,500}\\.([a-zA-Z]{1,500})(?::[0-9]{1,500})?)';
         var linkPrefixPattern = `(?:${protocolLinkPrefixPattern}|${simpleLinkPrefixPattern})`;
         var linkPattern = `(${linkPrefixPattern}(?:[^\\s()\\ud800-\\udfff]{0,500}))`;
         var emailPattern =
            "([\\wа-яёА-ЯЁ!#$%&'*+\\-/=?^`{|}~.]{1,500}@[^\\s@()\\ud800-\\udfff]{1,500}\\.([\\wа-яёА-ЯЁ]{1,500}))";
         var endingPattern = '([^.,:\\s()\\ud800-\\udfff])';
         var linkParseRegExp = new RegExp(
            `(?:(?:${emailPattern}|${linkPattern})${endingPattern})|(.|\\s)`,
            'g'
         );

         it('correct link with protocol without wrapping in tag a', function () {
            var str = 'https://ya.ru';
            var result = [true, 'https://ya.ru'];
            var linkParseResult = linkParseRegExp.exec(str);
            while (linkParseResult !== null) {
               var [match, , , linkToCheck, linkPrefix, linkDomain, ending] = linkParseResult;
               if (linkToCheck) {
                  var checkResultNode = linkDecorateUtils.normalizeLink(
                     linkToCheck,
                     linkDomain,
                     ending,
                     linkPrefix,
                     match,
                     false
                  );
                  expect(result).toEqual(checkResultNode);
               }
               linkParseResult = linkParseRegExp.exec(str);
            }
         });

         it('correct link with protocol with wrapping in tag a', function () {
            var str = 'https://ya.ru';
            var result = [
               true,
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ]
            ];
            var linkParseResult = linkParseRegExp.exec(str);
            while (linkParseResult !== null) {
               var [match, , , linkToCheck, linkPrefix, linkDomain, ending] = linkParseResult;
               if (linkToCheck) {
                  var checkResultNode = linkDecorateUtils.normalizeLink(
                     linkToCheck,
                     linkDomain,
                     ending,
                     linkPrefix,
                     match,
                     true
                  );
                  expect(result).toEqual(checkResultNode);
               }
               linkParseResult = linkParseRegExp.exec(str);
            }
         });

         it('correct link without protocol without wrapping in tag a', function () {
            var str = 'ya.ru';
            var result = [true, 'http://ya.ru'];
            var linkParseResult = linkParseRegExp.exec(str);
            while (linkParseResult !== null) {
               var [match, , , linkToCheck, linkPrefix, linkDomain, ending] = linkParseResult;
               if (linkToCheck) {
                  var checkResultNode = linkDecorateUtils.normalizeLink(
                     linkToCheck,
                     linkDomain,
                     ending,
                     linkPrefix,
                     match,
                     false
                  );
                  expect(result).toEqual(checkResultNode);
               }
               linkParseResult = linkParseRegExp.exec(str);
            }
         });

         it('correct link without protocol with wrapping in tag a', function () {
            var str = 'ya.ru';
            var result = [
               true,
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://ya.ru',
                     target: '_blank'
                  },
                  'ya.ru'
               ]
            ];
            var linkParseResult = linkParseRegExp.exec(str);
            while (linkParseResult !== null) {
               var [match, , , linkToCheck, linkPrefix, linkDomain, ending] = linkParseResult;
               if (linkToCheck) {
                  var checkResultNode = linkDecorateUtils.normalizeLink(
                     linkToCheck,
                     linkDomain,
                     ending,
                     linkPrefix,
                     match,
                     true
                  );
                  expect(result).toEqual(checkResultNode);
               }
               linkParseResult = linkParseRegExp.exec(str);
            }
         });

         it('incorrect link', function () {
            var str = 'vk.comma';
            var result = [false, 'vk.comma'];
            var linkParseResult = linkParseRegExp.exec(str);
            while (linkParseResult !== null) {
               var [match, , , linkToCheck, linkPrefix, linkDomain, ending] = linkParseResult;
               if (linkToCheck) {
                  var checkResultNode = linkDecorateUtils.normalizeLink(
                     linkToCheck,
                     linkDomain,
                     ending,
                     linkPrefix,
                     match,
                     false
                  );
                  expect(result).toEqual(checkResultNode);
               }
               linkParseResult = linkParseRegExp.exec(str);
            }
         });
      });

      describe('needDecorate', function () {
         beforeEach(function () {
            decoratedLinkService = Env.constants.decoratedLinkService;
            decoratedLinkHost = Env.constants.decoratedLinkHost;
            Env.constants.decoratedLinkService = '/test/';
            Env.constants.decoratedLinkHost = '';
            linkDecorateUtils.clearNeedDecorateGlobals();
         });
         afterEach(function () {
            Env.constants.decoratedLinkService = decoratedLinkService;
            Env.constants.decoratedLinkHost = decoratedLinkHost;
         });
         it('not a link', function () {
            var parentNode = [
               'p',
               [
                  'b',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('parent node is not a paragraph', function () {
            var parentNode = [
               'h1',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href is not equal link value', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'not https://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it("link haven't href", function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href length more then given maximum', function () {
            var maxLenght = linkDecorateUtils.getHrefMaxLength(),
               linkHref = 'https://ya.ru/';
            linkHref = linkHref + 'a'.repeat(maxLenght - linkHref.length + 1);
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: linkHref,
                     target: '_blank'
                  },
                  linkHref
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href starts from "file://"', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'file://test-perfleakps/leaks/test/30_03_19/21_06_58.zip',
                     target: '_blank'
                  },
                  'file://test-perfleakps/leaks/test/30_03_19/21_06_58.zip'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href starts from "smb://"', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'smb://test-perfleakps/leaks/test/30_03_19/21_06_58.zip',
                     target: '_blank'
                  },
                  'smb://test-perfleakps/leaks/test/30_03_19/21_06_58.zip'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href starts from "viber://"', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'viber://pa?chatURI=aliceinsbiswonderland',
                     target: '_blank'
                  },
                  'viber://pa?chatURI=aliceinsbiswonderland'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href start from "sbisplugin://"', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'sbisplugin://Screenshot-0.0.0.0?1111|1111',
                     target: '_blank'
                  },
                  'sbisplugin://Screenshot-0.0.0.0?1111|1111'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href start from Notes://', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'Notes://zeos/44257BA00035A56E/C270CBA9754D51AB44257AC00053E904/55AC612E1C06A75D432586AE0024B08D',
                     target: '_blank'
                  },
                  'Notes://zeos/44257BA00035A56E/C270CBA9754D51AB44257AC00053E904/55AC612E1C06A75D432586AE0024B08D'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href starts from "data:image" (base64)', function () {
            const src =
               'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAOoAAAA4CAYAAADzYmRqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwMTQgNzkuMTU2Nzk3LCAyMDE0LzA4LzIwLTA5OjUzOjAyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MEIwRUE3NjMxMTQxMUU1QjIwNDg3Mjg2Rjc1RjZFMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MEIwRUE3NTMxMTQxMUU1QjIwNDg3Mjg2Rjc1RjZFMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQjQ1QkEwREVGMzYxMUU0QUFFRUUyQzJGOTE1ODI3OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQjQ1QkEwRUVGMzYxMUU0QUFFRUUyQzJGOTE1ODI3OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRG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';
            var parentNode = [
               'p',
               [
                  'img',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: src,
                     target: '_blank'
                  },
                  src
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link href starts from "file://" and has "http" inside', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'smb://test-perfleakps/leaks/http/30_03_19/21_06_58.zip',
                     target: '_blank'
                  },
                  'smb://test-perfleakps/leaks/http/30_03_19/21_06_58.zip'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('link is not in the end of paragraph', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'not https://ya.ru'
               ],
               'some node after link'
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(false);
         });
         it('need decorate case - 1', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(true);
         });
         it('need decorate case - 2', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ],
               '       '
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(true);
         });
         it('need decorate case - 3', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ],
               ['br']
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(true);
         });
         it('need decorate case - 4', function () {
            var parentNode = [
               'p',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ],
               '      ',
               ['br']
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(true);
         });
         it('need decorate case - 5', function () {
            var parentNode = [
               'pre',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(true);
         });
         it('need decorate case - 6', function () {
            var parentNode = [
               'div',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'https://ya.ru',
                     target: '_blank'
                  },
                  'https://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(true);
         });
         it('need decorate case - 7', function () {
            var parentNode = [
               'div',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'http://ya.ru',
                     target: '_blank'
                  },
                  'http://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(true);
         });

         it('need decorate uncoded href', function () {
            var href = 'https://pre-test-online.sbis.ru/call/user/любитель_взг/';
            var parentNode = [
               'div',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: decodeURI(href),
                     target: '_blank'
                  },
                  href
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBeTruthy();
         });

         it('need decorate with capital letters in protocol', function () {
            var parentNode = [
               'div',
               [
                  'a',
                  {
                     class: 'asLink',
                     rel: 'noreferrer noopener',
                     href: 'HtTpS://ya.ru',
                     target: '_blank'
                  },
                  'HtTpS://ya.ru'
               ]
            ];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBe(true);
         });
         it('only good links, separated by space chars', function () {
            var i,
               parentNode = [
                  'p',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ' https://ya.ru ',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ' ',
                  ['a', { href: 'http://a' }, 'http://a'],
                  '   ' + nbsp + '\t',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['br'],
                  ['a', { href: 'http://a' }, 'http://a'],
                  '      ',
                  ['a', { href: 'http://a' }, 'http://a']
               ],
               expectedNeedDecorate = [
                  undefined,
                  true,
                  true,
                  true,
                  true,
                  true,
                  true,
                  true,
                  false,
                  true,
                  true,
                  true
               ],
               expectedFromStringArray = [
                  [
                     [],
                     ' ',
                     ['span', { class: 'LinkDecorator__wrap' }, decoratedLinkFirstChildNode],
                     ' '
                  ],
                  ' ',
                  '   ' + nbsp + '\t',
                  '      '
               ],
               checkNeedDecorate;

            for (i = 1; i < parentNode.length; ++i) {
               checkNeedDecorate = linkDecorateUtils.needDecorate(parentNode[i], parentNode);
               expect(checkNeedDecorate).toEqual(expectedNeedDecorate[i]);
            }
            while (expectedFromStringArray.length) {
               var checkFromString = linkDecorateUtils.getDecoratedLink('');
               var expectedFromString = expectedFromStringArray.shift();
               expect(checkFromString).toEqual(expectedFromString);
            }
            expect(linkDecorateUtils.getDecoratedLink('')).toBeFalsy();
         });
         it('br tag as end of paragraph', function () {
            var i,
               parentNode = [
                  'p',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['br'],
                  ['a', { href: 'http://a' }, 'http://a'],
                  'some www.ya.ru link'
               ],
               expectedNeedDecorate = [undefined, true, true, false, false, true],
               expectedFromStringArray = [[[], 'some ', wwwLinkNode, ' link']],
               checkNeedDecorate;

            for (i = 1; i < parentNode.length; ++i) {
               checkNeedDecorate = linkDecorateUtils.needDecorate(parentNode[i], parentNode);
               expect(checkNeedDecorate).toEqual(expectedNeedDecorate[i]);
            }
            while (expectedFromStringArray.length) {
               var checkFromString = linkDecorateUtils.getDecoratedLink('');
               var expectedFromString = expectedFromStringArray.shift();
               expect(checkFromString).toEqual(expectedFromString);
            }
            expect(linkDecorateUtils.getDecoratedLink('')).toBeFalsy();
         });

         it('string with "\\n" in the beginning as end of paragraph', function () {
            var i,
               parentNode = [
                  'pre',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['a', { href: 'http://a' }, 'http://a'],
                  '\nsome text\n',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['a', { href: 'http://a' }, 'http://a'],
                  '        \nsome text\n',
                  ['a', { href: 'http://a' }, 'http://a'],
                  'some text'
               ],
               expectedNeedDecorate = [undefined, true, true, true, true, true, true, false, true],
               expectedFromStringArray = ['\nsome text\n', '        \nsome text\n', 'some text'],
               checkNeedDecorate;

            for (i = 1; i < parentNode.length; ++i) {
               checkNeedDecorate = linkDecorateUtils.needDecorate(parentNode[i], parentNode);
               expect(checkNeedDecorate).toEqual(expectedNeedDecorate[i]);
            }
            while (expectedFromStringArray.length) {
               var checkFromString = linkDecorateUtils.getDecoratedLink('');
               var expectedFromString = expectedFromStringArray.shift();
               expect(checkFromString).toEqual(expectedFromString);
            }
            expect(linkDecorateUtils.getDecoratedLink('')).toBeFalsy();
         });

         it('two links before text and two links after', function () {
            var i,
               parentNode = [
                  'p',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['a', { href: 'http://a' }, 'http://a'],
                  'some text',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['a', { href: 'http://a' }, 'http://a']
               ],
               expectedNeedDecorate = [undefined, false, false, true, true, true],
               expectedFromStringArray = ['some text'],
               checkNeedDecorate;

            for (i = 1; i < parentNode.length; ++i) {
               checkNeedDecorate = linkDecorateUtils.needDecorate(parentNode[i], parentNode);
               expect(checkNeedDecorate).toEqual(expectedNeedDecorate[i]);
            }
            while (expectedFromStringArray.length) {
               var checkFromString = linkDecorateUtils.getDecoratedLink('');
               var expectedFromString = expectedFromStringArray.shift();
               expect(checkFromString).toEqual(expectedFromString);
            }
            expect(linkDecorateUtils.getDecoratedLink('')).toBeFalsy();
         });
         it('two links before tag with text and two links after', function () {
            var i,
               parentNode = [
                  'p',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['span', 'some text'],
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['a', { href: 'http://a' }, 'http://a']
               ],
               expectedNeedDecorate = [undefined, false, false, false, true, true],
               checkNeedDecorate;

            for (i = 1; i < parentNode.length; ++i) {
               checkNeedDecorate = linkDecorateUtils.needDecorate(parentNode[i], parentNode);
               expect(checkNeedDecorate).toEqual(expectedNeedDecorate[i]);
            }
         });
         it('good link, space, bad link, good link', function () {
            var i,
               parentNode = [
                  'p',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ' ',
                  ['a', { href: 'http://ResidentSleeper' }, 'http://a'],
                  ['a', { href: 'http://a' }, 'http://a']
               ],
               expectedNeedDecorate = [undefined, false, true, false, true],
               checkNeedDecorate;

            for (i = 1; i < parentNode.length; ++i) {
               checkNeedDecorate = linkDecorateUtils.needDecorate(parentNode[i], parentNode);
               expect(checkNeedDecorate).toEqual(expectedNeedDecorate[i]);
            }
         });
         it('spaces after link', function () {
            var i,
               parentNode = ['p', ['a', { href: 'http://a' }, 'http://a'], '  \t '],
               expectedNeedDecorate = [undefined, true, true],
               checkNeedDecorate;

            for (i = 1; i < parentNode.length; ++i) {
               checkNeedDecorate = linkDecorateUtils.needDecorate(parentNode[i], parentNode);
               expect(checkNeedDecorate).toEqual(expectedNeedDecorate[i]);
            }
         });
         it('spaces with style after link', function () {
            var i,
               parentNode = [
                  'p',
                  ['a', { href: 'http://a' }, 'http://a'],
                  ['span', { style: 'text-decoration: underline' }, ['strong', '        ']]
               ],
               expectedNeedDecorate = [undefined, false, false],
               checkNeedDecorate;

            for (i = 1; i < parentNode.length; ++i) {
               checkNeedDecorate = linkDecorateUtils.needDecorate(parentNode[i], parentNode);
               expect(checkNeedDecorate).toEqual(expectedNeedDecorate[i]);
            }
         });

         it('clear fake needDecorate attribute - 1', function () {
            var firstAttributesObject = { href: 'https://ya.ru' };
            var secondAttributesObject = { href: 'https://ya.ru' };
            var parentNode = [
               'p',
               ['a', firstAttributesObject, 'https://ya.ru'],
               ['a', secondAttributesObject, 'https://ya.ru']
            ];
            var firstNeedDecorate = linkDecorateUtils.needDecorate(parentNode[1], parentNode);
            var secondNeedDecorate = linkDecorateUtils.needDecorate(parentNode[2], parentNode);
            expect(firstNeedDecorate).toBeTruthy();
            expect(secondNeedDecorate).toBeTruthy();
            expect(firstAttributesObject.hasOwnProperty('__needDecorate')).toBeFalsy();
            expect(secondAttributesObject.hasOwnProperty('__needDecorate')).toBeFalsy();
         });

         it('clear fake needDecorate attribute - 2', function () {
            var firstAttributesObject = { href: 'https://ya.ru' };
            var secondAttributesObject = { href: 'https://ya.ru' };
            var parentNode = [
               'p',
               ['a', firstAttributesObject, 'Some text, not a href'],
               ['a', secondAttributesObject, 'Some text, not a href']
            ];
            var firstNeedDecorate = linkDecorateUtils.needDecorate(parentNode[1], parentNode);
            var secondNeedDecorate = linkDecorateUtils.needDecorate(parentNode[2], parentNode);
            expect(firstNeedDecorate).toBeFalsy();
            expect(secondNeedDecorate).toBeFalsy();
            expect(firstAttributesObject.hasOwnProperty('__needDecorate')).toBeFalsy();
            expect(secondAttributesObject.hasOwnProperty('__needDecorate')).toBeFalsy();
         });
      });
      describe('decorateLink', function () {
         beforeEach(function () {
            decoratedLinkService = Env.constants.decoratedLinkService;
            decoratedLinkHost = Env.constants.decoratedLinkHost;
            Env.constants.decoratedLinkService = '/test/';
            Env.constants.decoratedLinkHost = '';
            linkDecorateUtils.clearNeedDecorateGlobals();
         });
         afterEach(function () {
            Env.constants.decoratedLinkService = decoratedLinkService;
            Env.constants.decoratedLinkHost = decoratedLinkHost;
         });
         it('decorate a good link', function () {
            expect(linkDecorateUtils.getDecoratedLink(linkNode)).toEqual([
               'span',
               { class: 'LinkDecorator__wrap' },
               decoratedLinkFirstChildNode
            ]);
         });
         it('wrap link in string without decorating', function () {
            var parentNode = ['h1', 'see my link: https://ya.ru'];
            var expectedFromString = [[], 'see my link: ', linkNode];
            expect(linkDecorateUtils.needDecorate(parentNode[1], parentNode)).toBeTruthy();
            var checkFromString = linkDecorateUtils.getDecoratedLink(parentNode[1]);
            expect(expectedFromString).toEqual(checkFromString);
         });
      });
   });
});
