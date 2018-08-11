import R from "ramda";

const foreignRelationStruct = (mainTableName) => {
  const mainTable = mainTableName;
  const foreignTables = [];

  return {
    addForeignTable: foreignTableName => {
      foreignTables.push(foreignTableName);
    },
    getMainTable: () => {
      return mainTable;
    },

    getForeignTables: () => {
      return foreignTables;
    }
  };
};

const extractAlterTableName = (line) => {
  const alterCommands = "ALTER TABLE".split(" ");
  const foreignKeyClause = "FOREIGN KEY";
  const addConstraintCommand = "ADD CONSTRAINT";


  const tables = R.pipe(
      R.split(' '),
      R.ifElse(
          R.pipe(
              R.intersection(alterCommands),
              R.equals(alterCommands)
          ),
          R.apply((...array) => array[2]),
          R.apply(()=> null)
      )
  );

  return tables(line);
};

const extractForeignRelation = () => {
  const foreignRelationStruts = [];
  return {
    getRelation: () => {
      return foreignRelationStruts;
    },
    extract: line => {
      const alterTableName = extractAlterTableName(line);
      if (!R.isEmpty(alterTableName)) {
        foreignRelationStruts.push(foreignRelationStruct(alterTableName));
      }

      // if (line.indexOf("REFERENCES") === 0) {
      //   const relation = foreignRelationStruts[foreignRelationStruts.length - 1];
      //   relation.addForeignTable(line);
      // }
    }
  }
};

module.exports = extractForeignRelation;
