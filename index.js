import lineReader from 'line-reader';

import foreignRelationExtractor from './src/extractor/foreign-relation-extractor';

const fileName = './tablev.sql';

const foreignRelation = foreignRelationExtractor();

const done = () => {
  foreignRelation.getRelation().forEach((relation) => {
    console.log(`relation is ${relation.getMainTable()}`);
  });
};

lineReader.eachLine(fileName, (line, last) => {
  foreignRelation.extract(line);
  if (last) {
    done();
    return false;
  }
  return true;
});
