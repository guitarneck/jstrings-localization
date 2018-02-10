// JSDoc 3.5.5
/** 
 * @class       Localization
 * @classdesc   Localization is a singleton. It helps to localise strings with jstrings files.
 * @hideconstructor
 * @author      Laurent STEFAN <guitarneck@free.fr>
 * @since       Feb 9, 2018
 * @version     2.0.0
 * @copyright   2012-2018 Laurent STEFAN. All rights reserved.
 *
 * @example
 * Localization.language( ["fr","en"], "en" );
 * console.log( "Hello !".localise() );
 * // Salut !
 */

// Copyright (c) 2012-2018 Laurent STEFAN. All rights reserved.

var isBrowser = (function(o){try{return o === window}catch(e){return false}})(this);

Localization.prototype = {
    /** The version of Localization Class.
     * @const {string}
     * @readonly
     */
    version         : '2.0.0',

    /** The list of available codes of language translation.
     * @readonly
     * @type {array}
     */
    preferedLanguage: [],
    /** The default code of language translation.
     * @readonly
     * @type {string}
     */
    defaultLanguage : '',
    /** The current code of language translation.
     * @readonly
     * @type {string}
     */
    currentLanguage : '',
    /** The user languages preferences in browser, or the system language.
     * @readonly
     * @type {string}
     */
    userLanguage    : isBrowser
                    ?
                    navigator.language
                    :
                    process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || process.env.LC_MESSAGES
                    ,

    files           : {},

    strings         : {},

    END:null
};

function Localization ()
{
    /** Setting of the languages available in Localization.
     * @method      language
     * @memberof    Localization
     * @param       {array} preferedLang - The list of the codes of languages available.
     * @param       {string} defaultLang - The default language.
     */
    this.language = function ( preferedLang ,defaultLang )
    {
        this.preferedLanguage = preferedLang || this.preferedLanguage;
        this.defaultLanguage = defaultLang || this.defaultLanguage;
        this.currentLanguage = this.defaultLanguage;

        // Check and set current language
        for ( var i=0 ,l=this.preferedLanguage.length ; i<l ; i++ )
        {
            var reg = new RegExp( this.preferedLanguage[i] );
            if ( reg.test(this.userLanguage) ) { this.currentLanguage = this.preferedLanguage[i]; break }
        }
    };

    /** With a parameter, Sets the localisation of the class to a given language and refresh all the files.
     *  Without parameter, it returns the current language code.
     * @method      localize
     * @memberof    Localization
     * @param       {?string} lang - The code of language to be used.
     * @return      {string} The current code of language translation.
     */
    this.localize = function ( lang )
    {
        if ( lang && lang !== this.currentLanguage )
        {
            this.currentLanguage = this.defaultLanguage; // In case lang is not a part of prefered languages
            for ( var i=0 ,l=this.preferedLanguage.length ; i<l ; i++ )
            {
                if( lang === this.preferedLanguage[i] ) { this.currentLanguage = this.preferedLanguage[i]; break }
            }
            // Update strings for current language
            for ( var all in this.files ) { if ( this.files[all] ) this.load(all); }
        }
        return this.currentLanguage;    
    };

    // https://regex101.com/
    function loadStrings ( strings )
    {
        if ( strings != null && strings !== '' )
        {
            var reg = strings.match(/(.+)=(.+);/g);
            if( reg )
            {
                for ( var i=0 ,l=reg.length ; i<l ; i++ )
                {
                    var string = reg[i].split('='),
                        key = string.shift(),       // Get the key
                        value = string.join('');    // Join the rest of the value if any '=' where there
                    if ( (/^\[.+\];$/).test(value) )// Is it a multi-lines value ?
                    {
                        value = value.match(/(['"])((\\\1|.)*?)\1/g);
                        value = value.map(function(s){return s.replace(/^"(.*)"$/,'$1')})
                    }
                    else
                    {
                        value = value.replace(/^"(.*)";$/,'$1');
                    }
                    Localization.strings[key.replace(/^"(.+)"$/,'$1')] = value;
                }
                return true;
            }
        }
        return false;
    }

    function loadFile () {}

    if ( isBrowser )
    {
        if (!window.XMLHttpRequest)
        {
            for( var x=["MSXML2.XMLHTTP.6.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"] ,i=0 ,l=x.length ; i<l ; i++ )
            {
                try
                {
                    window.XMLHttpRequest = new Function('return ActiveXObject('+x[i]+')');
                    if ( new XMLHttpRequest() ) break;
                }
                catch (e) {window.XMLHttpRequest = null}
            }
        }

        function loadFile ( file )
        {    
            var string = '';
            try
            {
                var xreq = new XMLHttpRequest();
                    xreq.open("GET" ,file ,false); // No sync reading. Deprecated.
                    xreq.send();
            
                if ((xreq.readyState === 4 || xreq.readyState === "complete") && xreq.status === 200)
                {
                    string = xreq.responseText;
                }
            }
            catch(e) { console.log('loading failed on ' + file) }
        
            return string;
        }    
    }
    else
    {
        var fs = require('fs');

        function loadFile ( path )
        {
            var string = '';
            if ( fs.existsSync(path) ) string = fs.readFileSync(path ,{encoding:'utf8'});
            return string;
        }
    }

    /** Load a JStrings file for the translation.
     * @method      load
     * @memberof    Localization
     * @param       {string} file - The file to be loaded.
     * @return      {boolean} True when loaded, false otherwise.
     */
    this.load = function ( file )
    {
        var reg ,path ,ext ,localizedFile ,xreq ,success;

        success = false;

        // File name and path
        path = file.split('/');
        localizedFile = path.pop(); // Get the filename
        path = path.join('/') + '/'; // rebuild the path
    
        // Localize the file
        reg = localizedFile.split('.')
        localizedFile = reg.shift() + '_' + this.currentLanguage; // filename without ext, localized
        ext = '.' + reg.join('.');

        success = loadStrings( loadFile( path + localizedFile + ext ) );
        if ( ! success )
        {
            // Default file ?
            success = loadStrings( loadFile( file ) );
        }

        this.files[file] = success;
    
        return success;
    };

    /** The native String object.
     * @namespace String
     */

    /** Localise a string object.
     * @method      localize
     * @memberof    String
     * @return      {string} A translated string when found, otherwise the same string.
     * @example
     * "translation please".localize();
     */
    String.prototype.localize = function ()
    {
        var txt = this.toString();
        var ret = (typeof Localization.strings[txt] !== 'undefined') ? Localization.strings[txt] : txt;
        return (ret instanceof Array)  ? ret.join('\n') : ret;
    };
}

var Localization = new Localization();

if( !isBrowser ) module.exports = Localization;