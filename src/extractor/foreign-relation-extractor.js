import R from 'ramda';
import foreignRelationStruct from './foreign-relation-struct';

const spaceSplitter = ' ';

const extractAlterTableName = () => {
  const alterCommands = 'ALTER TABLE'.split(spaceSplitter);
  const isCommandWithAlterTable = R.pipe(
    R.intersection(alterCommands),
    R.equals(alterCommands),
  );
  return R.pipe(
    R.split(spaceSplitter),
    R.ifElse(
      isCommandWithAlterTable,
      array => array[2],
      () => null,
    ),
  );
};


const extractReferTableFun = (foreignRelationStruts) => {
  const hasMainTable = () => foreignRelationStruts.length > 0;
  const shouldExtractAsReferTable = R.both(
    hasMainTable,
    R.contains('REFERENCES'),
  );
  return R.pipe(
    R.split(spaceSplitter),
    R.ifElse(
      shouldExtractAsReferTable,
      array => array[1],
      () => null,
    ),
  );
};

const extractForeignRelation = () => {
  const foreignRelationStruts = [];
  return {
    getRelation: () => foreignRelationStruts,
    extract: (line) => {
      const alterTableName = extractAlterTableName()(line);
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
