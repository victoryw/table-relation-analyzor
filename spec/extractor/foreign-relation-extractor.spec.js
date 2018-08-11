const should = require('chai').should();
const R = require('ramda');
const foreignRelationExtractor = require('../../src/extractor/foreign-relation-extractor');

describe('foreign relation extract', () => {
  it('should extract the main table', () => {



    const extractor = foreignRelationExtractor();

    const tableName = '"PICCPROD"."T_PRODUCT_FEE"';
    const line = 'ALTER TABLE ' + tableName + ' ' +
        'ADD CONSTRAINT "FK_PRODUCT_FEE__BASIC_ID" ' +
        'FOREIGN KEY ("BASIC_ID")';


    console.log(R.intersection("ALTER TABLE".split(" "), R.split(' ',line)));

    extractor.extract(line);
    console.log('line ', extractor.getRelation());
    extractor.getRelation().should.to.have.lengthOf(1);
    R.head(extractor.getRelation()).getMainTable().should.equal(tableName);
  });

  it('should test R', () => {
    const tableName = '"PICCPROD"."T_PRODUCT_FEE"';
    const line = 'ALTER TABLE ' + tableName + ' ' +
        'ADD CONSTRAINT "FK_PRODUCT_FEE__BASIC_ID" ' +
        'FOREIGN KEY ("BASIC_ID")';

    const strings = "ALTER TABLE".split(" ");
    const message = R.intersection(strings, R.split(' ',line));

    console.log(
    )
  });
});