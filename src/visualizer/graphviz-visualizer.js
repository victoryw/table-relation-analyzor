import * as graphviz from 'graphviz';

const graphvizVisualizer = (relations) => {
  const g = graphviz.digraph('G');
  relations.forEach((relation) => {
    g.addNode(relation.getMainTable(), '');
    relation.getForeignTables().forEach((foreignTable) => {
      g.addNode(foreignTable, '');
    });
  });
  return g;
};
module.exports = graphvizVisualizer;
