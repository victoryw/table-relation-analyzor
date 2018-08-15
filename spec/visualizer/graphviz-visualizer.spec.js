import * as chai from 'chai';
import R from 'ramda';
import foreignRelationStruct from '../../src/extractor/foreign-relation-struct';
import graphvizVisualizer from '../../src/visualizer/graphviz-visualizer';

const should = chai.should();
describe('should use the graphviz to visualize the table relations', () => {
  const mainTable = 'mainTable';
  const referTable1OfMainTable = '1-F2M';
  const referTable2OfMainTable = '2-F2M';
  let relation;

  beforeEach(() => {
    relation = foreignRelationStruct(mainTable);
    relation.addForeignTable(referTable1OfMainTable);
    relation.addForeignTable(referTable2OfMainTable);
  });

  const shouldExitsTargetTable = (graphvizInstance, tableId) => {
    const mainNode = graphvizInstance.getNode(tableId);
    should.exist(mainNode);
  };

  it('should render the main table as node', () => {
    const graphvizInstance = graphvizVisualizer([relation]);
    shouldExitsTargetTable(graphvizInstance, mainTable);
  });

  it('should render the refer table as node', () => {
    const graphvizInstance = graphvizVisualizer([relation]);
    shouldExitsTargetTable(graphvizInstance, referTable1OfMainTable);
    shouldExitsTargetTable(graphvizInstance, referTable2OfMainTable);
  });

  it('should render the refer table with main table as edge', () => {
    const graphvizInstance = graphvizVisualizer([relation]);

    const referenceSelector = (
      mainTableName,
      referTableName,
      edge,
    ) => edge.nodeOne.id === mainTableName
      && edge.nodeTwo.id === referTableName;

    const mainTableReferSelector = R.curry(referenceSelector)(mainTable);
    const referTable1ToMainRelation = R.filter(
      mainTableReferSelector(referTable1OfMainTable),
      graphvizInstance.edges,
    );
    should.exist(referTable1ToMainRelation);

    const referTable2ToMainRelation = R.filter(
      mainTableReferSelector(referTable2OfMainTable),
      graphvizInstance.edges,
    );
    should.exist(referTable2ToMainRelation);
  });
});
