import Jasmine from "jasmine";
import reporters from "jasmine-reporters";

const jasmine = new Jasmine({});

jasmine.loadConfigFile('jasmine.json');
const junitReporter = new reporters.JUnitXmlReporter({
    savePath: 'test-results',
    filePrefix: 'tests',
    consolidateAll: true
});
jasmine.addReporter(junitReporter);
jasmine.execute();
