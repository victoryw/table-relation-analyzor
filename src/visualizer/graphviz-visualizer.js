import * as graphviz from 'graphviz';

const constructNodes = (relations, g) => {
  relations.forEach((relation) => {
    relation.getForeignTables().forEach((foreignTable) => {
      g.from(relation.getMainTable()).to(foreignTable);
    });
  });
};
module.exports = (relations) => {
  const g = graphviz.digraph('G');
  constructNodes(relations, g);
  return g;
};
