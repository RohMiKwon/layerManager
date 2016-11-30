describe("layermanager", function() {
    var layer;
    beforeEach(function() {
        smg.global.layermanager.init(document.querySelector('#layer'));
    });

    describe("레이어 초기화", function() {
    	it("페이지 초기 진입시 레이어 닫혀 있어야 한다.", function() {});   
    });

    describe("레이어 토글", function() {
    	describe("레이어 열림", function(){
    		it("레이어 열림 버튼 클릭시 레이어열림", function() {});
    		it("레이어 열림 때 dim 열림", function() {});
    	});
    	describe("레이어 닫힘", function(){
    		it("레이어 닫기 버튼 클릭시 레이어 닫힘", function() {});
    		it("레이어 열림 때 dim 닫힘", function() {});
    	});        
    });

});
