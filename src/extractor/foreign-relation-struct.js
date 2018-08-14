exports.foreignRelationStruct = (mainTableName) => {
  const mainTable = mainTableName;
  const foreignTables = [];

  return {
    addForeignTable: (foreignTableName) => {
      foreignTables.push(foreignTableName);
    },
    getMainTable: () => mainTable,

    getForeignTables: () => foreignTables,
  };
};
