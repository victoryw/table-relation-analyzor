import 'chai/register-expect';
import 'chai/register-should';
import R from 'ramda';
import foreignRelationExtractor from '../../src/extractor/foreign-relation-extractor';
import foreignRelationStruct from '../../src/extractor/foreign-relation-struct';

describe('foreign relation extract', () => {
  const expectedMainTable = 'T_PRODUCT_FEE';
  const correctMainTableCommand = ' '
    + `ALTER TABLE ${`"PICCPROD"."${expectedMainTable}"`} `
    + 'ADD CONSTRAINT "FK_PRODUCT_FEE__BASIC_ID" '
    + 'FOREIGN KEY ("BASIC_ID")';

  const expectedReferTableName = 'T_CONTRACT_PRODUCT';
  const referTableCommand = `REFERENCES ${`"PICCPROD"."${expectedReferTableName}"`} ("ITEM_ID") ENABLE NOVALIDATE;`;


  let lineExtractor = null;
  beforeEach(() => {
    lineExtractor = foreignRelationExtractor();
  });

  describe('integration scenario', () => {
    it('should extract the table relation', () => {
      lineExtractor.extract(correctMainTableCommand);
      lineExtractor.extract(referTableCommand);

      const tableRelation = R.head(lineExtractor.getRelations());
      tableRelation.getMainTable().should.equal(expectedMainTable);
      R.head(tableRelation.getForeignTables()).should.equal(expectedReferTableName);
    });
  });

  describe('main table extract test', () => {
    it('should extract the main table', () => {
      lineExtractor.extract(correctMainTableCommand);
      lineExtractor.getRelations().should.to.have.lengthOf(1);
      R.head(lineExtractor.getRelations()).getMainTable().should.equal(expectedMainTable);
    });

    it('should not extract the main table when the input line format is without alter table', () => {
      const invalidMainTableInputLine = 'ALTER TABLE1 anya '
        + 'ADD CONSTRAINT "FK_PRODUCT_FEE__BASIC_ID" '
        + 'FOREIGN KEY ("BASIC_ID")';

      lineExtractor.extract(invalidMainTableInputLine);
      lineExtractor.getRelations().should.to.have.lengthOf(0);
    });

    it('should throw error when table name not connect with dot', () => {
      const errorTableNameCommand = `ALTER TABLE NAME ${expectedMainTable} `
        + 'ADD CONSTRAINT "FK_PRODUCT_FEE__BASIC_ID" '
        + 'FOREIGN KEY ("BASIC_ID")';

      expect(() => {
        lineExtractor.extract(errorTableNameCommand);
      }).to.throw('table name should connect with dot');
    });
  });

  describe('refer table extract test', () => {
    const pushMainTable = (mainTableName, extractor) => {
      const mainTable = foreignRelationStruct(mainTableName);
      extractor.getRelations().push(mainTable);
    };

    it('should extract the refer table', () => {
      pushMainTable('mainTable', lineExtractor);
      lineExtractor.extract(referTableCommand);

      const foreignTables = R.head(lineExtractor.getRelations()).getForeignTables();
      foreignTables.should.to.have.lengthOf(1);
      lineExtractor.getRelations().should.to.have.lengthOf(1);
      R.head(foreignTables).should.equal(expectedReferTableName);
    });

    it('should not extract refer table when no references command in line', () => {
      const invalidReferTableCommand = `REFERENCESd ${expectedReferTableName} ("ITEM_ID") ENABLE NOVALIDATE;`;
      pushMainTable('mainTable', lineExtractor);
      lineExtractor.extract(invalidReferTableCommand);

      const foreignTables = R.head(lineExtractor.getRelations()).getForeignTables();
      foreignTables.should.have.lengthOf(0);
    });

    it('should not extract refer table when no main table', () => {
      lineExtractor.extract(referTableCommand);
      lineExtractor.getRelations().should.to.have.lengthOf(0);
    });

    it('should extract refer table with last main table when there are multiple main tables', () => {
      const mainTable1Name = 'mainTable1';
      pushMainTable(mainTable1Name, lineExtractor);
      const mainTable2Name = 'mainTable2';
      pushMainTable(mainTable2Name, lineExtractor);
      lineExtractor.extract(referTableCommand);

      const mainTableFinder = mainTableName => R.find(
        relation => relation.getMainTable() === mainTableName,
        lineExtractor.getRelations(),
      );

      mainTableFinder(mainTable1Name).getForeignTables().should.to.have.lengthOf(0);

      const foreignTables = mainTableFinder(mainTable2Name).getForeignTables();
      foreignTables.should.to.have.lengthOf(1);
      R.head(foreignTables).should.equal(expectedReferTableName);
    });

    it('should throw error when table name not connect with dot', () => {
      pushMainTable('mainTable', lineExtractor);

      const errorTableNameCommand = `REFERENCES ${expectedReferTableName} ("ITEM_ID") ENABLE NOVALIDATE;`;

      expect(() => {
        lineExtractor.extract(errorTableNameCommand);
      }).to.throw('table name should connect with dot');
    });
  });
});
