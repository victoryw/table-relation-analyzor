import R from 'ramda';
import 'chai/register-should';
import foreignRelationExtractor from '../../src/extractor/foreign-relation-extractor';
import foreignRelationStruct from '../../src/extractor/foreign-relation-struct';

describe('foreign relation extract', () => {
  it('should extract the main table', () => {
    const extractor = foreignRelationExtractor();

    const tableName = '"PICCPROD"."T_PRODUCT_FEE"';
    const line = `ALTER TABLE ${tableName} `
        + 'ADD CONSTRAINT "FK_PRODUCT_FEE__BASIC_ID" '
        + 'FOREIGN KEY ("BASIC_ID")';

    extractor.extract(line);
    extractor.getRelation().should.to.have.lengthOf(1);
    R.head(extractor.getRelation()).getMainTable().should.equal(tableName);
  });

  it('should extract the refer table', () => {
    const expectedReferTableName = '"PICCPROD"."T_CONTRACT_PRODUCT"';
    const referTableCommand = `REFERENCES ${expectedReferTableName} ("ITEM_ID") ENABLE NOVALIDATE;`;

    const extractor = foreignRelationExtractor();
    const mainTable = foreignRelationStruct('mainTable');
    extractor.getRelation().push(mainTable);
    extractor.extract(referTableCommand);

    const foreignTables = R.head(extractor.getRelation()).getForeignTables();
    foreignTables.should.to.have.lengthOf(1);
    extractor.getRelation().should.to.have.lengthOf(1);
    R.head(foreignTables).should.equal(expectedReferTableName);
  });
});
