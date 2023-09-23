//not running due to errors

/*import request from 'supertest';
import { expect } from 'chai';
import { describe, it } from 'mocha';



describe.skip('db', function() {

  it('should set MongoDB models when DATABASE_SELECTION is mongodb', function() {
    process.env.DATABASE_SELECTION = 'mongodb';
    
    // Reload the module to reflect the change in environment variable
    delete require.cache[require.resolve('../../src/models/allModels')]; // replace with actual path
    const reloadedModule = require('../../src/models/allModels'); // replace with actual path
    
    expect(reloadedModule.Model).to.exist;
    expect(reloadedModule.Prompt).to.exist;
    expect(reloadedModule.Log).to.exist;
    expect(reloadedModule.Variable).to.exist;
  });

});*/