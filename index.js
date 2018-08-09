const graphviz = require('graphviz');
const lineReader = require('line-reader');

const fileName = './tablev.sql';
const tableRelation = graphviz.digraph("Tables");
const extractTableName = line => {
  if(line.includes('CREATE TABLE')) {
    const firstMarkAsBeginning = line.indexOf("\"");
    const lastMarkAsEnd = line.lastIndexOf("\"");
    return line.substring(firstMarkAsBeginning, lastMarkAsEnd + 1);
  }
  return null;
};

let lastTable;

lineReader.eachLine(fileName, (line, last) => {
  const tableName = extractTableName(line);

  if(!!tableName) {
    const node = tableRelation.addNode(tableName,  {"color" : "blue"});
    node.set( "style", "filled" );
    if(!!lastTable) {
      const edge =tableRelation.addEdge( node,  lastTable);
      edge.set( "color", "red" );
    }
    lastTable = tableName;
  }

  if (last) {
    console.log( tableRelation.to_dot() );
    return false;
  }
});

