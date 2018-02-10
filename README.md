[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url] [![dependencies][dependencies-image]][dependencies-url]
[![dev dependencies][dev-dependencies-image]][dev-dependencies-url]

# JStrings Localization

A javascript singleton Localization for both Node.js and Web browsers.
The localised files are based on [JStrings](#about-jsctrings) format.

# Table of Contents

* [Install](#install)
* [About JStrings](#about-jsctrings)
* [Usage](#usage)
    * [With Node.js](#With-node.js)
    * [In a browser](#in-a-browser)
* [Localization class](#localization-class)
    * [Fields](#fields)
    * [Methods](#methods)
* [String prototype](#string-prototype)
* [License](#license)

# Install

```bash
$ npm i -D jstrings-localization
```

Or:

```bash
$ npm install --save-dev jstrings-localization
```

# About JStrings

__JStrings__ are an extension of the [String Resources][apple-strings-url]
format used inside Apple developments.
This format is usefull during localisation process, human readable, and easy to shared.
The _Apple Strings Resources_ is in text format and contains pairs of key-value that are `strings`.
Comments can be sets inside the text file.

```bash
/* A one line comment */
"My first key"="My first value";

/*
 *  A multi-lines comment
 *
 */
"My second key"="My second value";
 
```

> The file format is very simple !

Composed with the filename itself, followed by optinals underscore and ISO code,
terminated by the extension.
```bash
filename[_iso].extension

// Default file
common.jstrings.txt
// English localised file
common_en.jstrings.txt
// French localised file
common_fr.jstrings.txt
...etc
```

> ISO code's format and extensions are whatever you'd like _(See : ISO 639)_.
>
> The default file is used when no localised file according to a code were found.

The __JStrings__ introduces multi-lines values.
It used a specifics values format, surrounded by brackets.
The output result will be joined by a newline.

```bash
/* A multi-lines values */
"My 1st line..."=["My 1st line","followed by a 2nd line","","Ended by a 4th line"];
```

It's up to you to define the key you'd like to use.
It must be unique along the files you're using.
Best practive is to be verbose in your code.

You'd like to add some variables in your string, for example, like this :
```javascript
    "Welcome %1 ! Rock\'n\'Roll !".localize().replace('%1',user.name);
```

There's no specific format for the variables.
You can use any caracters you'd like at your own risk.
By the way, you can combine strings together.

# Usage

## With Node.js
```javascript
"use strict";

const Localization    = require("Localization");

const languages       = ["de","en","es","he","fr"];
let   lang            = "en";

Localization.language( languages, lang );

Localization.load("strings/common.jstrings.txt");
Localization.load("strings/myapp.jstrings.txt");

console.log( "Hello world !".localize() );
```

## In a browser
```html
    <script type="text/javascript" src="js/jq/jquery.min.js"></script>
    <script type="text/javascript" src="js/lib/Localization.cls.js"></script>
    <script type="text/javascript">
        var languages       = ["de","en","es","he","fr"];
        var lang            = "en";

        var page            = "welcome.html";

        Localization.language( languages, lang );

        lang = /fr/.test(navigator.language) ? 'fr' : 'en'; //Force 'fr' if ok 
        Localization.localize( lang );

        if( ! Localization.load("strings/common.jstrings.txt") )
            console.log("Localization common FAILED !");
            
        if( ! Localization.load("strings/myapp.jstrings.txt")  )
            console.log("Localization myapp  FAILED !");

        splash( "Hello world !".localize() );
        
        $("#content").load("inc/" + page.localize());
    </script>
```

# Localization class

The implementation of the Localization Class is based on the Singleton.
You don't need to instanciate it.

## Fields

| Name | Type | Description |
|:----------------|:------------:|:------------------------------------------------------|
| version | `string` | The class version. |
| preferedLanguage | `array`| The languages your application can handel. |
| defaultLanguage | `string`| Default language used when unmatched user language. |
| currentLanguage | `string`| The language in use. |
| userLanguage | `string`| The user language preferences or system language |

> You must not sets this values. Use the methods insteed. Keep in mind they are __read only__.
 
## Methods

* __language( preferedLang ,defaultLang )__

  _Global settings of the Localization class. You would call it first._
  
    * preferedLang
    
      Type: `array`
      
      _List of the languages your application handle._
    
    * defaultLang
    
      Type : `string`
      
      _The default language used when user language's can't match any in the list._

---

* __localize( lang )__

  _Specified the language for the localisation.
  Updates also all the files previouly loaded to the specified language._
  
  * lang
  
    Type : `string`
    
    _The language used for the comming localisations. When you changed the code at run time,
    keep in mind to refresh your application._

    > __Important ! There is _no ordered list_ of the files. Don't think _overwriting_ !__

---

* __load( file )__

  _Load a file in path format, according to the localised settings._

  * file
  
    Type : `string`
    
    _The path of the file to load. The format must not contains any iso code._
    

# String prototype

* __localize()__

  _Localise the string value or the variable value.
  When no corresponding translation is available, the string remains the same._
  
  ```javascript
    "localize me".localize()
  ```

# License

[MIT © guitarneck](./LICENSE)

[apple-strings-url]: https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html

[downloads-image]: https://img.shields.io/npm/dm/jstrings-localization.svg
[npm-image]: https://img.shields.io/npm/v/jstrings-localization.svg
[npm-url]: https://www.npmjs.com/package/jstrings-localization

[travis-image]: https://img.shields.io/travis/guitarneck/jstrings-localization.svg?label=travis-ci
[travis-url]: https://travis-ci.org/guitarneck/jstrings-localization

[coveralls-image]: https://coveralls.io/repos/github/guitarneck/jstrings-localization/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/guitarneck/jstrings-localization?branch=master

[dev-dependencies-image]: https://david-dm.org/guitarneck/jstrings-localization/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/guitarneck/jstrings-localization?type=dev
[dependencies-image]: https://david-dm.org/guitarneck/jstrings-localization/status.svg
[dependencies-url]: https://david-dm.org/guitarneck/jstrings-localization
