"use strict";

var isBrowser = (function(o){try{return o === window}catch(e){return false}})(this);

function testLocalization ( Localization ,assert ) {

const languages = ["ar","da","de","en","es","fi","fr","he","ja","ru","sv","vi","zh"];
let   lang = "en";

describe('Languages' ,function(){

    it('should have an empty situation - (very bad)' ,function(done){
        Localization.language();
        assert.ok( Localization.preferedLanguage instanceof Array );
        assert.equal( Localization.preferedLanguage.length ,0 );
        assert.equal( Localization.defaultLanguage ,'' );
        done();
    });

    it('should be initialized' ,function(done){
        Localization.language( languages, lang );
        assert.equal( Localization.preferedLanguage.length ,languages.length );
        assert.equal( Localization.preferedLanguage.join('') ,languages.join('') );
        assert.equal( Localization.defaultLanguage ,lang );
        done();
    });
    
    it('should exists a valid current language' ,function(done){
        assert.ok( languages.some(function(l){return l === Localization.currentLanguage}) );
        done();
    });

    it('should have a conform default language' ,function(done){
        assert.ok( Localization.defaultLanguage === lang );
        done();
    });

    it('should become the default language' ,function(done){
        Localization.localize( "iso_Klingon".localize() );
        assert.ok( Localization.defaultLanguage === lang );
        done();
    });
    
});

const strings = isBrowser ? '../strings' : 'strings';

describe('Loading files' ,function(){

    it('should load the jstrings file' ,function(done){
        assert.ok( Localization.load(strings+"/hello.jstrings.txt") );
        assert.ok( Localization.load(strings+"/languages-iso639-1.jstrings.txt") );
        done();
    });

    it('should failed on loading the jstrings file' ,function(done){
        assert.ok( ! Localization.load(strings+"/failedme.jstrings.txt") );
        done();
    });

    it('should not load an empty file' ,function(done){
        assert.ok( ! Localization.load(strings+"/empty.jstrings.txt") );
        done();
    });

    it('should not load an malformed file' ,function(done){
        assert.ok( ! Localization.load(strings+"/malformed.jstrings.txt") );
        done();
    });
    
});

describe('Translation strings' ,function(){

    it('should be the same when no translation exists' ,function(done){
        assert.ok( "this is stupid" === "this is stupid".localize() );
        done();
    });

    var japanese = "Japanese".localize();

    it('should be translated in another language' ,function(done){
        assert.equal( Localization.localize( "iso_Japanese".localize() ) ,"ja" );
        assert.ok( japanese !== "Japanese".localize() );
        assert.equal( "Japanese".localize() ,"にほんご" );
        done();
    });

    it('should comeback the same' ,function(done){
        assert.equal( Localization.localize( "iso_English".localize() ) ,lang );
        assert.ok( japanese === "Japanese".localize() );
        done();
    });

});

describe('Empty value' ,function(){

    it('should load files with some empty values' ,function(done){
        assert.ok( Localization.load(strings+"/html-dir.jstrings.txt") );
        done();
    });

    it('should retrieve an empty value' ,function(done){
        Localization.localize( "iso_Hebrew".localize() );
        assert.ok( "html-dir".localize() === "rtl" );
        Localization.localize( "iso_French".localize() );
        assert.ok( "html-dir".localize() === "" );
        done();
    });

});

describe('Multilines strings' ,function(){

    it('should load some multi-lines fields' ,function(done){
        assert.ok( Localization.load(strings+"/multilines.jstrings.txt") );
        done();
    });

    it('should return a multi-lines value' ,function(done){
        assert.ok( "multilines...".localize() === 'Line 1\nLine 2\n\nLine 3' );
        done();
    });

});

};

if (! isBrowser ) module.exports = testLocalization;