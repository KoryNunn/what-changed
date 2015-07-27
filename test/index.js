var test = require('grape'),
    WhatChanged = require('../');

test('new', function(t){
    t.plan(1);

    var x = 1,
        whatChanged = new WhatChanged();

    t.deepEqual(
        whatChanged.update(null),
        {
            type: true,
            value: true
        }
    );
});

test('nothing by value', function(t){
    t.plan(1);

    var x = 1,
        whatChanged = new WhatChanged(x);

    t.deepEqual(
        whatChanged.update(1),
        {}
    );
});

test('nothing by reference', function(t){
    t.plan(1);

    var x = {a:1},
        whatChanged = new WhatChanged(x);

    t.deepEqual(
        whatChanged.update(x),
        {}
    );
});

test('value', function(t){
    t.plan(1);

    var x = 1,
        whatChanged = new WhatChanged(x);

    t.deepEqual(
        whatChanged.update(2),
        {'value':true}
    );
});

test('reference', function(t){
    t.plan(1);

    var x = {a:1, b:2},
        whatChanged = new WhatChanged(x);

    x = {a:1, b:2};

    t.deepEqual(
        whatChanged.update(x),
        {'reference': true}
    );
});

test('keys', function(t){
    t.plan(1);

    var x = {a:1},
        whatChanged = new WhatChanged(x);

    x.y = 1;

    t.deepEqual(
        whatChanged.update(x),
        {
            'keys': true,
            'structure': true
        }
    );
});

test('reference and structure', function(t){
    t.plan(1);

    var x = {a:1},
        whatChanged = new WhatChanged(x);

    x = {b:1};

    t.deepEqual(
        whatChanged.update(x),
        {
            'structure': true,
            'keys': true,
            'reference': true
        }
    );
});

test('same reference, different keys', function(t){
    t.plan(1);

    var x = {a:1},
        whatChanged = new WhatChanged(x);

    x.majigger = 2;

    t.deepEqual(
        whatChanged.update(x),
        {
            'structure': true,
            'keys': true
        }
    );
});

test('same reference, different structure', function(t){
    t.plan(1);

    var x = {a:{b:1}},
        whatChanged = new WhatChanged(x);

    x.a.b = 2;

    t.deepEqual(
        whatChanged.update(x),
        {'structure': true}
    );
});

test('many changes', function(t){
    t.plan(7);

    var x = 1,
        whatChanged = new WhatChanged(x);

    t.deepEqual(
        whatChanged.update(1),
        {}
    );

    t.deepEqual(
        whatChanged.update(2),
        {
            value: true
        }
    );

    t.deepEqual(
        whatChanged.update(true),
        {
            value: true,
            type: true
        }
    );

    t.deepEqual(
        whatChanged.update('true'),
        {
            type: true
        }
    );

    var x = {};

    t.deepEqual(
        whatChanged.update(x),
        {
            type: true,
            value: true,
            keys: true,
            reference: true,
            structure: true
        }
    );

    x.y = 1;

    t.deepEqual(
        whatChanged.update(x),
        {
            keys: true,
            structure: true
        }
    );

    x.y = 2;

    t.deepEqual(
        whatChanged.update(x),
        {
            structure: true
        }
    );
});

test('dont track value', function(t){
    t.plan(1);

    var x = 1,
        whatChanged = new WhatChanged(x, '');

    t.deepEqual(
        whatChanged.update(2),
        {}
    );
});

test('dont track value type change', function(t){
    t.plan(1);

    var x = 1,
        whatChanged = new WhatChanged(x, 'type');

    t.deepEqual(
        whatChanged.update(true),
        {type:  true}
    );
});

test('type change to null', function(t){
    t.plan(1);

    var x = {},
        whatChanged = new WhatChanged(x, 'type');

    t.deepEqual(
        whatChanged.update(null),
        {type:  true}
    );
});

test('type change from null', function(t){
    t.plan(1);

    var x = null,
        whatChanged = new WhatChanged(x, 'type');

    t.deepEqual(
        whatChanged.update({}),
        {type:  true}
    );
});
