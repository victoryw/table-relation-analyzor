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

const extractTableName = tablename => R.pipe(
  R.split('.'),
  R.ifElse(
    array => array.length === 2,
    array => array[1],
    () => {
      throw new Error('not an array');
    },
  ),
  name => name.replace(/"/gi, ''),
)(tablename);

const extractForeignRelation = () => {
  const foreignRelationStruts = [];
  return {
    getRelations: () => foreignRelationStruts,
    extract: (line) => {
      const trimLine = line.trim();
      const alterTableName = extractAlterTableName()(trimLine);
      if (!R.isNil(alterTableName)) {
        foreignRelationStruts.push(foreignRelationStruct(
          extractTableName(alterTableName),
        ));
      }

      const referTableName = extractReferTableFun(foreignRelationStruts)(trimLine);
      if (!R.isNil(referTableName)) {
        const foreignTableName = extractTableName(referTableName);
        foreignRelationStruts[foreignRelationStruts.length - 1]
          .addForeignTable(
            foreignTableName,
          );
      }
    },
  };
};


module.exports = extractForeignRelation;
