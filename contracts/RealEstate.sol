pragma solidity ^0.4.23;

contract RealEstate {
    struct Buyer {
        address buyerAddress;
        bytes32 name;
        uint age;
    }

    mapping (uint => Buyer) public buyerInfo; // 매입자 정보 보관(id를 키 값으로)
    address public owner;
    address[10] public buyers; //매입자 계정 주소 저장

    //로그 포맷
    event LogBuyRealEstate( 
        address _buyer,
        uint _id
    );

    // 컨트랙 배포자가 해당 컨트랙의 소유자가 될 수 있게(현재 Accounts[0])
    constructor() public {
        owner = msg.sender;
    }

    //매물 구입 함수
    function buyRealEstate(uint _id, bytes32 _name, uint _age) public payable {
        require(_id >=0 && _id <=9); //id 유효성 검사
        buyers[_id] = msg.sender; // 현재 이 함수를 사용하고 있는 계정 저장(0부터)
        buyerInfo[_id] = Buyer(msg.sender, _name, _age); // 매입자 정보 저장

        owner.transfer(msg.value); //owner에게 ETH 전송
        emit LogBuyRealEstate(msg.sender, _id); //이벤트 정보
    }

    //읽기 전용 함수
    function getBuyerInfo(uint _id) public view returns (address, bytes32, uint) {
        Buyer memory buyer = buyerInfo[_id]; // 매입자 정보 읽기(id로 조회)
        return (buyer.buyerAddress, buyer.name, buyer.age);
    }

    //모든 매물에 대한 buyer 정보
    function getAllBuyers() public view returns (address[10]) {
        return buyers;
    }
}
