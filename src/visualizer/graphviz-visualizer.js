import * as graphviz from 'graphviz';

const constructNodes = (relations, g) => {
  relations.forEach((relation) => {
    g.addNode(relation.getMainTable(), '');
    relation.getForeignTables().forEach((foreignTable) => {
      g.addNode(foreignTable, '');
    });
  });
};
const graphvizVisualizer = (relations) => {
  const g = graphviz.digraph('G');
  constructNodes(relations, g);

  relations.forEach((relation) => {
    const mainTable = relation.getMainTable();
    relation.getForeignTables().forEach(foreign => g.addEdge(mainTable, foreign, {}));
  });
  return g;
};
module.exports = graphvizVisualizer;
