'use strict';

var format = require('string-template');
var fs = require('fs');
var path = require('path');
var capitalize = require('capitalize');

var marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

var template = fs.readFileSync(__dirname + '/../templates/template.html', 'utf8');

function createDocPage (fileName) {

    /* only process markdown files */
    if (path.extname(fileName) !== '.md') return;

    /* get the markdown data */
    var markdownContent = fs.readFileSync(__dirname + '/../markdown/' + fileName, 'utf8');

    /* convert it to html */
    var content = marked(markdownContent);

    /* strip the .md to save as .html */
    var exampleName = fileName.split('.md')[0];

    /* add html extension to fileName */
    var HTMLFileName = exampleName + '.html';

    /* create human-readable filename */
    var pageTitle = capitalize.words(exampleName.replace('-', ' '));

    /* insert the HTML content generated from markdown into our template */
    var page = format(template, {
        title: pageTitle,
        content: content
    });

    /* write the file! */
    fs.writeFile(__dirname + '/../html/' + HTMLFileName, page, function (err) {
        if (err) return console.log(err);

        console.log('Successfully wrote: ' + HTMLFileName);
    });

}

var files = fs.readdirSync(__dirname + '/../markdown/');

files.forEach(createDocPage);
