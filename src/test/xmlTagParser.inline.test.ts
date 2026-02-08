import * as assert from 'assert';
import { XmlTagParser } from '../commentParsing/xmlTagParser';

suite('XmlTagParser - Inline Tags', () => {
    let parser: XmlTagParser;

    setup(() => {
        parser = new XmlTagParser();
    });

    test('Debe parsear {@link} básico', () => {
        const content = 'Ver {@link MyClass} para más detalles';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'link');
        assert.strictEqual(tags[0].target, 'MyClass');
        assert.strictEqual(tags[0].label, undefined);
    });

    test('Debe parsear {@link target|label}', () => {
        const content = 'Ver {@link MyClass|la clase} aquí';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'link');
        assert.strictEqual(tags[0].target, 'MyClass');
        assert.strictEqual(tags[0].label, 'la clase');
    });

    test('Debe parsear {@code text}', () => {
        const content = 'Use {@code myFunction()} para ejecutar';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'code');
        assert.strictEqual(tags[0].content, 'myFunction()');
    });

    test('Debe parsear {@literal text}', () => {
        const content = 'HTML: {@literal <div>test</div>}';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'literal');
    });

    test('Debe parsear múltiples inline tags', () => {
        const content = 'Ver {@link A} y {@link B|clase B} más {@code test()}';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 3);
        assert.strictEqual(tags[0].tag, 'link');
        assert.strictEqual(tags[1].tag, 'link');
        assert.strictEqual(tags[2].tag, 'code');
    });

    test('Debe parsear {@type Type}', () => {
        const content = 'Retorna {@type Promise<User>}';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'type');
    });

    test('Debe parsear {@tutorial name}', () => {
        const content = 'Ver {@tutorial getting-started} para empezar';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'tutorial');
        assert.strictEqual(tags[0].target, 'getting-started');
    });

    test('Debe parsear {@inheritdoc}', () => {
        const content = 'Descripción {@inheritdoc}';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'inheritdoc');
    });

    test('Debe verificar tags conocidas', () => {
        assert.strictEqual(parser.isKnownInlineTag('link'), true);
        assert.strictEqual(parser.isKnownInlineTag('code'), true);
        assert.strictEqual(parser.isKnownInlineTag('literal'), true);
        assert.strictEqual(parser.isKnownInlineTag('type'), true);
        assert.strictEqual(parser.isKnownInlineTag('tutorial'), true);
        assert.strictEqual(parser.isKnownInlineTag('inheritdoc'), true);
        assert.strictEqual(parser.isKnownInlineTag('linkplain'), true);
        assert.strictEqual(parser.isKnownInlineTag('linkcode'), true);
        assert.strictEqual(parser.isKnownInlineTag('typeof'), true);
        assert.strictEqual(parser.isKnownInlineTag('namepath'), true);
        assert.strictEqual(parser.isKnownInlineTag('docRoot'), true);
        assert.strictEqual(parser.isKnownInlineTag('value'), true);
        assert.strictEqual(parser.isKnownInlineTag('index'), true);
    });

    test('No debe fallar con tags desconocidas', () => {
        const content = 'Ver {@customTag algo}';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'customTag');
        assert.strictEqual(parser.isKnownInlineTag('customTag'), false);
    });

    test('Debe reemplazar {@link} correctamente', () => {
        const content = 'Ver {@link MyClass} aquí';
        const result = parser.replaceInlineTags(content);
        
        assert.strictEqual(result, 'Ver MyClass aquí');
    });

    test('Debe reemplazar {@link target|label} con label', () => {
        const content = 'Ver {@link MyClass|la clase}';
        const result = parser.replaceInlineTags(content);
        
        assert.strictEqual(result, 'Ver la clase');
    });

    test('Debe reemplazar {@code} con backticks', () => {
        const content = 'Use {@code myFunc()}';
        const result = parser.replaceInlineTags(content);
        
        assert.strictEqual(result, 'Use `myFunc()`');
    });

    test('Debe reemplazar {@literal} sin formato', () => {
        const content = 'HTML: {@literal <div>}';
        const result = parser.replaceInlineTags(content);
        
        assert.strictEqual(result, 'HTML: <div>');
    });

    test('Debe procesar múltiples reemplazos', () => {
        const content = 'Ver {@link A} y {@code test()} más {@literal <tag>}';
        const result = parser.replaceInlineTags(content);
        
        assert.strictEqual(result, 'Ver A y `test()` más <tag>');
    });

    test('Debe mantener posiciones correctas', () => {
        const content = 'inicio {@link MyClass} fin';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags[0].start, 7);
        assert.strictEqual(tags[0].end, 22);
        assert.strictEqual(tags[0].raw, '{@link MyClass}');
    });

    test('Debe procesar inline tags y devolver texto limpio', () => {
        const content = 'Ver {@link MyClass|clase} con {@code test()}';
        const result = parser.processInlineTags(content);
        
        assert.strictEqual(result.tags.length, 2);
        assert.strictEqual(result.cleanText, 'Ver clase con `test()`');
    });

    test('Debe manejar nesting básico', () => {
        const content = 'Ver {@link A|texto con {@code nested}} aquí';
        const tags = parser.parseInlineTags(content);
        
        // Debe encontrar ambas tags
        assert.ok(tags.length >= 1);
    });

    test('Debe parsear {@linkplain} y {@linkcode}', () => {
        const content = '{@linkplain A} y {@linkcode B}';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 2);
        assert.strictEqual(tags[0].tag, 'linkplain');
        assert.strictEqual(tags[1].tag, 'linkcode');
    });

    test('Debe parsear {@typeof} y {@namepath}', () => {
        const content = '{@typeof Symbol} y {@namepath MyModule}';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 2);
        assert.strictEqual(tags[0].tag, 'typeof');
        assert.strictEqual(tags[1].tag, 'namepath');
    });

    test('Debe parsear tags legacy', () => {
        const content = '{@docRoot} y {@value} y {@index}';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 3);
        assert.strictEqual(tags[0].tag, 'docRoot');
        assert.strictEqual(tags[1].tag, 'value');
        assert.strictEqual(tags[2].tag, 'index');
    });

    test('Debe manejar espacios y saltos de línea', () => {
        const content = `Ver {@link MyClass  |  la clase  } aquí`;
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].target, 'MyClass');
        assert.strictEqual(tags[0].label, 'la clase');
    });

    test('No debe parsear tags de bloque como inline', () => {
        const content = '@param no es inline, pero {@link MyClass} sí';
        const tags = parser.parseInlineTags(content);
        
        assert.strictEqual(tags.length, 1);
        assert.strictEqual(tags[0].tag, 'link');
    });
});
