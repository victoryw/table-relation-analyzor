const foreignRelationStruct = (mainTableName) => {
  const mainTable = mainTableName
  const foreignTables = []

  return {
    addForeignTable: foreignTableName => {
      foreignTables.push(foreignTableName)
    },
    getMainTable: () => {
      return mainTable
    },

    getForeignTables: () => {
      return foreignTables
    }
  }
}

module.exports = foreignRelationStruct