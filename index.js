import lineReader from 'line-reader';

import foreignRelationExtractor from './src/extractor/foreign-relation-extractor';

const fileName = './tablev.sql';

const foreignRelation = foreignRelationExtractor();

const done = () => {
  foreignRelation.getRelations().forEach((relation) => {
    const mainTable = relation.getMainTable();
    console.log(`relation is ${mainTable}`);
    relation.getForeignTables().forEach(referTable => console.log(` refer table is ${referTable}`));
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
