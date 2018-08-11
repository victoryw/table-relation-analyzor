const lineReader = require('line-reader');
const R = require('ramda');

const foreignRelationExtractor = require('./src/extractor/foreign-relation-extractor');

const fileName = './tablev.sql';

const foreignRelation = foreignRelationExtractor();

const done = () => {
  R.each(relation => {
    console.log('relation is ', relation.getMainTable());
  }, foreignRelation.getRelation());
};

lineReader.eachLine(fileName, (line, last) => {
  foreignRelation.extract(line);
  if (last) {
    done();
    return false;
  }
});

