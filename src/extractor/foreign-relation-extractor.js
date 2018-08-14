import R from 'ramda';
import foreignRelationStruct from './foreign-relation-struct';

const spaceSplitter = ' ';

const extractAlterTableName = (line) => {
  const alterCommands = 'ALTER TABLE'.split(spaceSplitter);
  const tables = R.pipe(
    R.split(' '),
    R.ifElse(
      R.pipe(
        R.intersection(alterCommands),
        R.equals(alterCommands),
      ),
      R.apply((...array) => array[2]),
      R.apply(() => null),
    ),
  );
  return tables(line);
};


const extractReferTableFun = foreignRelationStruts => R.pipe(
  R.split(spaceSplitter),
  R.ifElse(
    R.and(
      R.apply((...array) => array.some(part => part === 'REFERENCES')),
      R.apply(() => foreignRelationStruts.length > 0),
    ),
    R.apply((...array) => array[1]),
    R.apply(() => null),
  ),
);

const extractForeignRelation = () => {
  const foreignRelationStruts = [];
  return {
    getRelation: () => foreignRelationStruts,
    extract: (line) => {
      const alterTableName = extractAlterTableName(line);
      if (!R.isNil(alterTableName)) {
        foreignRelationStruts.push(foreignRelationStruct(alterTableName));
      }

      const referTableName = extractReferTableFun(foreignRelationStruts)(line);
      if (!R.isNil(referTableName)) {
        foreignRelationStruts[foreignRelationStruts.length - 1].addForeignTable(referTableName);
      }
    },
  };
};


module.exports = extractForeignRelation;
