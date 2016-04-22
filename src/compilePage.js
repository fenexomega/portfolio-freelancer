var jsdom         = require('jsdom')
var fs            = require('fs')
var projetosJson  = require('./projetos.json')
var personalInfo  = require('./info.json')
var sources       = require('./elements.js')
var myDocument    = undefined

function applyPersonalInfo(document)
{
  document.findFirstTag('title').innerHTML  = personalInfo['title']
  document.getElementById('brand').innerHTML   = personalInfo['name']
  return document
}

function compileAndWriteDocument(document,fileName)
{
  document.findFirstTag = function(tag)
  {
      return this.getElementsByTagName(tag)[0]
  }
  // Put tags into header
  document.findFirstTag('head').innerHTML = sources.head;
  // Put tags into body
  document.findFirstTag('body').innerHTML = sources.header + sources.scripts;

  //replace tags with infos on json
  document = applyPersonalInfo(document)

  fs.writeFileSync(fileName,document.findFirstTag('html').outerHTML,'utf8');
}

jsdom.env('./html1.html',["../js/jquery.js"],
  function(err,window){

    compileAndWriteDocument(window.document,"../test.html");

  })
