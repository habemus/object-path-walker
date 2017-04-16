const assert = require('assert');
const should = require('should');

const ObjectPathWalker = require('../');

describe('new ObjectPathWalker(object, path)', function () {

  it('should require an object to be passed as first argument', function () {
    assert.throws(function () {
      new ObjectPathWalker(undefined, 'a.ab');
    }, 'object is required');
  });

  it('should require a non-empty path to be passed as second argument', function () {

    assert.throws(function () {
      new ObjectPathWalker({}, '');
    }, 'path is required');

    assert.throws(function () {
      new ObjectPathWalker({}, undefined);
    }, 'path is required');

    assert.throws(function () {
      new ObjectPathWalker({}, undefined);
    }, 'path is required');

  });

  it('should initialize the current pointer to the object itself', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');


    walker.currentPath().should.eql([]);
    should(walker.currentKey()).eql(undefined);
    walker.currentValue().should.equal(obj);
    walker.currentDepth().should.eql(0);
  });

});

describe('ObjectPathWalker#next()', function () {

  it('should move the current pointer to the next depth level', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.next();

    walker.currentPath().should.eql(['a']);
    walker.currentKey().should.eql('a');
    walker.currentValue().should.equal(obj.a);
    walker.currentDepth().should.eql(1);
  });

  it('should error in case there is no next step', function () {
    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.next();
    walker.next();
    walker.next();

    assert.throws(function () {
      walker.next();
    }, 'no next step');
  });

});

describe('ObjectPathWalker#hasNext()', function () {

  it('should check if there is a next key', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.hasNext().should.eql(true);
    walker.next();
    walker.hasNext().should.eql(true);
    walker.next();
    walker.hasNext().should.eql(true);
    walker.next();
    walker.hasNext().should.eql(false);
  });

});

describe('ObjectPathWalker#nextValue()', function () {

  it('should retrieve the next value without modifying state', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.nextValue().should.eql(obj.a);
    walker.currentValue().should.eql(obj);
  });

});

describe('ObjectPathWalker#nextKey()', function () {

  it('should retrieve the next key without modifying state', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.nextKey().should.eql('a');
    walker.currentValue().should.eql(obj);
  });

});


describe('ObjectPathWalker#previous()', function () {

  it('should move the current pointer to the previous depth level', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.next();
    walker.next();

    walker.currentPath().should.eql(['a', 'ab']);
    walker.currentKey().should.eql('ab');
    walker.currentValue().should.equal(obj.a.ab);
    walker.currentDepth().should.eql(2);

    walker.previous();

    walker.currentPath().should.eql(['a']);
    walker.currentKey().should.eql('a');
    walker.currentValue().should.equal(obj.a);
    walker.currentDepth().should.eql(1);
  });

  it('should error in case there is no previous step', function () {
    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    assert.throws(function () {
      walker.previous();
    }, 'no previous step');
  });

});

describe('ObjectPathWalker#hasPrevious()', function () {

  it('should check if there is a next key', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.hasPrevious().should.eql(false);
    walker.next();
    walker.hasPrevious().should.eql(true);
  });

});

describe('ObjectPathWalker#previousValue()', function () {

  it('should retrieve the next value without modifying state', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.next();
    walker.next();

    walker.previousValue().should.eql(obj.a);
    walker.currentValue().should.eql(obj.a.ab);
  });

});

describe('ObjectPathWalker#previousKey()', function () {

  it('should retrieve the next key without modifying state', function () {

    var obj = {
      a: {
        aa: 'aa-value',
        ab: {
          aaa: 'aaa-value',
          aab: 'aab-value',
          aac: 'aac-value'
        },
      },
      b: {
        ba: 'ba-value'
      }
    };

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.next();
    walker.next();

    walker.previousKey().should.eql('a');
    walker.currentValue().should.eql(obj.a.ab);
  });

});

describe('ObjectPathWalker#remainingPath()', function () {

  it('should retrieve the remaining path', function () {

    var obj = {};

    var walker = new ObjectPathWalker(obj, 'a.ab.aac');

    walker.remainingPath().should.eql(['a', 'ab', 'aac']);

    walker.next();

    walker.remainingPath().should.eql(['ab', 'aac']);
  });
})
