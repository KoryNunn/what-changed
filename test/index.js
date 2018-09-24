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
            value: true,
            any: true
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
        {
            value:true,
            any: true
        }
    );
});

test('reference', function(t){
    t.plan(1);

    var x = {a:1, b:2},
        whatChanged = new WhatChanged(x);

    x = {a:1, b:2};

    t.deepEqual(
        whatChanged.update(x),
        {
            reference: true,
            any: true
        }
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
            keys: true,
            structure: true,
            any: true
        }
    );
});

test('bulk keys', function(t){
    t.plan(1);

    var startTime = Date.now();

    var x = {};
    for(var i = 0; i < 1000; i++){
        x[i] = i;
    }
    var whatChanged = new WhatChanged(x);

    for(var i = 0; i < 100; i++){
        whatChanged.update(x);
    }

    console.log(Date.now() - startTime);

    t.deepEqual(
        whatChanged.update(x),
        {}
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
            structure: true,
            keys: true,
            reference: true,
            any: true
        }
    );
});

test('shallowStructure', function(t){
    t.plan(2);

    var x = {a:1, b:{a:1}},
        whatChanged = new WhatChanged(x, 'shallowStructure');

    x.b.a = 2;

    t.deepEqual(
        whatChanged.update(x),
        {}
    );

    x.a = 2;

    t.deepEqual(
        whatChanged.update(x),
        {
            shallowStructure: true,
            any: true
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
            structure: true,
            keys: true,
            any: true
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
        {
            structure: true,
            any: true
        }
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
            value: true,
            any: true
        }
    );

    t.deepEqual(
        whatChanged.update(true),
        {
            value: true,
            type: true,
            any: true
        }
    );

    t.deepEqual(
        whatChanged.update('true'),
        {
            type: true,
            any: true
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
            structure: true,
            any: true
        }
    );

    x.y = 1;

    t.deepEqual(
        whatChanged.update(x),
        {
            keys: true,
            structure: true,
            any: true
        }
    );

    x.y = 2;

    t.deepEqual(
        whatChanged.update(x),
        {
            structure: true,
            any: true
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
        {
            type:  true,
            any: true
        }
    );
});

test('type change to null', function(t){
    t.plan(1);

    var x = {},
        whatChanged = new WhatChanged(x, 'type');

    t.deepEqual(
        whatChanged.update(null),
        {
            type:  true,
            any: true
        }
    );
});

test('type change from null', function(t){
    t.plan(1);

    var x = null,
        whatChanged = new WhatChanged(x, 'type');

    t.deepEqual(
        whatChanged.update({}),
        {
            type:  true,
            any: true
        }
    );
});

test('cyclic structures', function(t){
    t.plan(2);

    var x = {},
        whatChanged = new WhatChanged(x, 'structure');

    x.x = x;
    x.a = 1;

    t.deepEqual(
        whatChanged.update(x),
        {
            structure:  true,
            any: true
        }
    );

    x.a = '1';

    t.deepEqual(
        whatChanged.update(x),
        {
            structure:  true,
            any: true
        }
    );
});
