var jsdom         = require('jsdom')
var fs            = require('fs')
var projetosJson  = require('./projetos.json')
var personalInfo  = require('./info.json')
var sources       = require('./elements.js')
var myDocument    = undefined

// PARAMETERS
var documentOutput = "../index.html"

function findLastTag(element,tagName)
{
  var size = element.getElementsByTagName(tagName).length;
  return element.getElementsByTagName(tagName)[size - 1];
}

function applyPersonalInfo(document)
{
  function findTagByIdAndOverwriteHTML(name)
  {
    document.getElementById(name).innerHTML = personalInfo[name]

  }

  document.findFirstTag('title').innerHTML  = personalInfo['title']
  findTagByIdAndOverwriteHTML('name')
  findTagByIdAndOverwriteHTML('brand')
  findTagByIdAndOverwriteHTML('skills')
  return document
}

function applyAbout(document)
{
  document.findFirstTag('body').innerHTML += sources.about;
  document.getElementById('about-text').innerHTML += personalInfo.about;
  return document;
}

function applyContact(document)
{
  document.findFirstTag('body').innerHTML += sources.footer;
  var contacts = personalInfo.contactsArray;
  var i = 0;
  for (c of contacts) {
    var li = document.createElement('li')
    li.innerHTML = sources.contactCell;
    li.getElementsByTagName('i')[0].className += ' fa-' + c.type;
    li.getElementsByTagName('a')[0].href = c.address;
    document.getElementById('contact-table').appendChild(li);

  }
  return document;
}


function applyProjects(document)
{
  function getPortfolioRow()
  {
    return document.getElementById('portfolio-row');
  }

  function setPortfolioModalByProject(project,id_nbr)
  {
    document.findFirstTag('body').innerHTML += sources.portfolioModal;
    findLastTag(document,'h2').innerHTML = project.title;
    findLastTag(document,'p').innerHTML  = project.description;
    findLastTag(document,'img').src      = project.image;
    document.getElementById('portfolioModal').id += id_nbr;
  }

  var projects = projetosJson.projectsArray;
  var i = 0;
  for (var p of projects) {
    getPortfolioRow().innerHTML += sources.portfolioCell;

    getPortfolioRow().getElementsByTagName('img')[i].src = p.image;
    getPortfolioRow().getElementsByTagName('a')[i].href = "#portfolioModal" + i;

    ++i;
  }

  i = 0;
  for (var p of projects) {
      setPortfolioModalByProject(p,i++);
  }

  return document;
}


function compileAndWriteDocument(document,fileName)
{
  document.findFirstTag = function(tag)
  {
    return this.getElementsByTagName(tag)[0];
  }
  // Put tags into header
  document.findFirstTag('head').innerHTML = sources.head;
  // Put tags into body
  document.findFirstTag('body')
  .innerHTML = sources.navigation + sources.header
    + sources.portfolioGrid;

  //replace tags with infos on json
  document = applyPersonalInfo(document);
  document = applyProjects(document);
  document = applyAbout(document);
  document = applyContact(document);
  document.findFirstTag('body')
  .innerHTML += sources.scripts;


  fs.writeFileSync(fileName,'<!DOCTYPE html>\n' + document.findFirstTag('html').outerHTML,'utf8');
}

jsdom.env('./html1.html',["../js/jquery.js"],
function(err,window){

  compileAndWriteDocument(window.document,documentOutput);

})
