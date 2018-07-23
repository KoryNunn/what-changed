# what-changed

Provides an overview of how a value changed since the last time you checked.

## usage

install:

    npm install what-changed

require:

    var WhatChanged = require('what-changed');

instantiate:

    var state = new WhatChanged([initial value]);

change the value, and get the change overview:

    state.update(123);

    // -> {type: true, value: true}


The following describes expected output based on how a value changes:

### 1, 1

    {}

### 1, 2

    {
        value: true,
        any: true
    }

### 1, true

    {
        value: true,
        type: true,
        any: true
    }

### 1, '1'

    {
        type: true,
        any: true
    }

### {a:1}, {a:1} (same instance)

    {}

### {a:1}, {a:1} (different instance)

    {
        reference: true
    }

### {a:1}, {b:1} (same instance)

    {
        keys: true,
        structure: true,
        any: true
    }


### {a:{b:1}}, {a:{b:2}} (same instance)

    {
        structure: true,
        any: true
    }


### {a:1}, {b:1} (different instance)

    {
        reference: true,
        keys: true,
        structure: true,
        any: true
    }