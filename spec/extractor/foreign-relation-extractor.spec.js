import R from "ramda";
import 'chai/register-should';
import foreignRelationExtractor from "../../src/extractor/foreign-relation-extractor";

describe('foreign relation extract', () => {
  it('should extract the main table', () => {
    const extractor = foreignRelationExtractor();

    const tableName = '"PICCPROD"."T_PRODUCT_FEE"';
    const line = 'ALTER TABLE ' + tableName + ' ' +
        'ADD CONSTRAINT "FK_PRODUCT_FEE__BASIC_ID" ' +
        'FOREIGN KEY ("BASIC_ID")';

    extractor.extract(line);
    extractor.getRelation().should.to.have.lengthOf(1);
    R.head(extractor.getRelation()).getMainTable().should.equal(tableName);
  });
});