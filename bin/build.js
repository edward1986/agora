'use strict';

var format = require('string-template');
var fs = require('fs');
var path = require('path');

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

var template = fs.readFileSync('./template.html', 'utf8');

function createPage (fileName) {

    if (path.extname(fileName) !== '.md') return;


    var markdownContent = fs.readFileSync('../docs/' + fileName, 'utf8');
    var content = marked(markdownContent);

    var exampleName = fileName.split('.md')[0]; // strip the .md to save as .html
    var pageTitle = exampleName.replace('-', ' ');
    var HTMLFileName = exampleName + '.html';

    var page = format(template, {
        title: pageTitle,
        content: content
    });

    fs.writeFile('../docs/html/' + HTMLFileName, page, function (err) {
        if (err) console.log(err);
    });
    //return page;
}

var files = fs.readdirSync('../docs');

files.forEach(createPage);
console.log(files);
