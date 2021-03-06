var Chemical = require("../lib/Chemical");
var Plasma = require("../lib/Plasma");

var MyChemical = Chemical.extend(function(mode){
  this.mode = mode;
});

describe("Plasma", function(){
  var plasma;

  it("should create new instance", function(){
    plasma = new Plasma();
  });

  it("should transmit chemical", function(next){
    plasma.on("test", function(c){
      expect(c.type).toBe("test");
      next();
    });
    plasma.emit(new Chemical("test"));
  });

  it("should transmit chemical with type", function(next){
    plasma.on(MyChemical, function(c){
      expect(c.mode).toBe("test");
      next();
    });
    plasma.emit(new MyChemical("test"));
  });

  it("should notify listener for chemical only once", function(){
    var c = 0;
    plasma.once("test2", function(){
      c += 1;
    });
    plasma.emit(new Chemical("test2"));
    plasma.emit(new Chemical("test2"));
    expect(c).toBe(1);
  });

  it("should unregister listener for chemical", function(){
    var c = 0;
    var m = function(){
      c += 1;
    }
    plasma.on("test3", m);
    plasma.emit(new Chemical("test3"));
    plasma.off("test3", m);
    plasma.emit(new Chemical("test3"));
    expect(c).toBe(1);
  });
  
  it("should not throw exception if no listeners are registered for a given chemical", function(){
    expect(function () {
      var plasma2 = new Plasma();
      plasma2.emit(new Chemical("Test 4"));
    }).not.toThrow(); 
  });
  
   it("propagates event until the handler returns value different from false", function(next){
    var plasma2 = new Plasma();
    var KEY = "test5";
    plasma2.on(KEY, function (chemical, callback) {
      return false;
    });
    
    plasma2.on(KEY, function (chemical, sender, callback) {
      return false;
    })
    
    plasma2.on(KEY, function (chemical, callback) {
      next();
    })
    
    plasma2.emit(new Chemical(KEY));
  });
   
  it("is decorated by passing an appropriate function to the use method", function () {
      var plasma2 = new Plasma();
      var decoration = function (state) {
        this.getState = function (id) {
          return state[id];
        };
        this.setState = function (id, val) {
          state[id] = val;
        };
      };
      
      var decorated = plasma2.use(decoration);
      //check plasma methods are still accessible
      plasma2.emit(new Chemical("Test 4"));
      
      decorated.setState("k", 5);
      var res = decorated.getState("k");
      expect(res).toBe(5);
    
  });
});