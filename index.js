import lineReader from 'line-reader';
import singeLineLogger from 'single-line-log';
import fs from 'fs';
import graphviBuilder from './src/visualizer/graphviz-visualizer';
import foreignRelationExtractor from './src/extractor/foreign-relation-extractor';

const logger = singeLineLogger.stdout;

const fileName = './tablev.sql';
const dotFileName = 'test.dotFileName';

const foreignRelation = foreignRelationExtractor();

const outPutDotFile = (graph, path) => {
  const dotContent = graph.to_dot();
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
  fs.writeFileSync(path, dotContent);
};

const done = () => {
  const graph = graphviBuilder(foreignRelation.getRelations());
  outPutDotFile(graph, dotFileName);
};

let totalFilesDone = 0;

lineReader.eachLine(fileName, (line, last) => {
  totalFilesDone += 1;
  logger('line done is,', totalFilesDone);
  foreignRelation.extract(line);
  if (last) {
    done();
    return false;
  }
  return true;
});
