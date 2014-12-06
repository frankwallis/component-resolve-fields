component-resolve-fields
========================

streams files resolved from component.json

allows you to specify which fields of component.json are used for local
and remote components.

components which have been linked using `component link` can use the same fields as local components

useful for setting up watch tasks for component builds which follow symbolic links and bundling test scripts etc

### Usage ###

`resolve.scripts(options?, onfile, done)`
`resolve.files(options?, onfile, done)`
`resolve.styles(options?, onfile, done)`
`resolve.custom(options, onfile, done)`

Options:

Name         	| Description								| Default
----------------|-------------------------------------------|-----------
fields			| The fields to use from component.json 	| "scripts"
localFields		| The fields to use for local components 	| optional
remoteFields	| The fields to use for remote components 	| optional
filterRx		| Filter all files using this RegExp 		| optional
localFilterRx	| Filter all local files using this RegExp 	| optional
remoteFilterRx	| Filter all remote files using this RegExp | optional
linkedLocals	| Consider linked components to be local 	| false
tree 			| In case you already have a tree 			| optional

### Example ###

```js
    var resolver = require('component-resolve-fields');

    /* get all specs and scripts from local components but
       just scripts from remote components */ 

    var options = {
    	fields: ["scripts", "specs"],
    	remoteFields: ["scripts"];
    }

    function add(file, cb) {
    	console.log("Found " + file.filename);
        cb();
    }

    function end() {
    	console.log('complete')
    }

    resolver.custom(options, add, end);
```