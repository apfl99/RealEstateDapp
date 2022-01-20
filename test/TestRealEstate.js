var RealEstate = artifacts.require("./RealEstate.sol"); //RealEstate import

contract('RealEstate', function(accounts){ // 계정 인자를 콜백으로 받음
    var realEstateInstance; //RealEsate 저장 변수

    it("컨트래픽의 소유자 초기화 테스팅", function(){
        //이하 구문은 소유자 확인
        return RealEstate.deployed().then(function(instance){
            realEstateInstance = instance;
            return realEstateInstance.owner.call();
        }).then(function(owner){ // 계정 값이 성공적으로 불러와질 경우
            //현재 네트워크의 첫번째 계정과 일치하는지 확인(대문자로 변환 후 비교)
            //assert.equal(실제값, 예상값, 다른 경우 출력문)
            assert.equal(owner.toUpperCase(), accounts[0].toUpperCase(),"owner가 가나슈 첫번째 계정과 동일하지 않습니다.")
        });
    });

    it("가나슈 두번째 계정으로 매물 아이디 0번 매입 후 이벤트 생성 및 매입자 정보와 buyers 배열 테스팅", function(){
        return RealEstate.deployed().then(function(instance) {
            realEstateInstance = instance;
            //매입
            return realEstateInstance.buyRealEstate(0, "sejong", 13, {from: accounts[1], value: web3.toWei(1.50,"ether")});
        }).then(function(receipt) { //트랜잭션 영수증 접근
            assert.equal(receipt.logs.length,1,"이벤트 하나가 생성되지 않았습니다.");
            assert.equal(receipt.logs[0].event, "LogBuyRealEstate", "이벤트가 LogBuyRealEstate가 아닙니다.");
            assert.equal(receipt.logs[0].args._buyer,accounts[1],"매입자가 가나슈 두번째 계정이 아닙니다.");
            assert.equal(receipt.logs[0].args._id,0,"매물 아이디가 0이 아닙니다.");
            return realEstateInstance.getBuyerInfo(0);
        }).then(function(buyerInfo) {
            assert.equal(buyerInfo[0].toUpperCase(),accounts[1].toUpperCase(),"매입자의 계정이 가나슈 두번째 계정과 일치하지 않습니다.");
            assert.equal(web3.toAscii(buyerInfo[1]).replace(/\0/g,''),"sejong","매입자의 이름이 sejong이 아닙니다.");
            assert.equal(buyerInfo[2], 13, "매입자의 나이가 13살이 아닙니다.");
            return realEstateInstance.getAllBuyers();
        }).then(function(buyers){
            assert.equal(buyers[0].toUpperCase(),accounts[1].toUpperCase(),"Buyers 배열 첫번째 인덱스 계정이 가나슈 두번째 계정과 일치하지 않습니다.");
        })
    })
});