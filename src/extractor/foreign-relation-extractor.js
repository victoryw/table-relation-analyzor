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
      throw new Error('table name should connect with dot');
    },
  ),
  name => name.replace(/"/gi, ''),
)(tablename);

module.exports = () => {
  const foreignRelationStruts = [];
  const extractMainTable = (trimLine) => {
    const alterTableName = extractAlterTableName()(trimLine);
    if (!R.isNil(alterTableName)) {
      foreignRelationStruts.push(foreignRelationStruct(
        extractTableName(alterTableName),
      ));
    }
  };
  const extractReferTable = (trimLine) => {
    const referTableName = extractReferTableFun(foreignRelationStruts)(trimLine);
    if (!R.isNil(referTableName)) {
      const foreignTableName = extractTableName(referTableName);
      foreignRelationStruts[foreignRelationStruts.length - 1]
        .addForeignTable(
          foreignTableName,
        );
    }
  };
  return {
    getRelations: () => foreignRelationStruts,
    extract: (line) => {
      const trimLine = line.trim();
      extractMainTable(trimLine);
      extractReferTable(trimLine);
    },
  };
};
