const app = require('express')();
const http = require('http').createServer(app);
const fs = require('fs');
const bodyParser = require('body-parser');
 app.use(bodyParser.json());

 app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type, enctype');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



 app.get('/getRandomNumber', (req, res) => {
    generateNumber();
    function generateNumber(){
    	fs.readFile('./numbers.json', 'utf-8', (err, data) => {
            if(err) throw err;
    		let randomNumber = getRandomNumber(1, 100);
    		let session = JSON.parse(data);
    		if(session.length === 100){
                session = [];
                fs.writeFile('./numbers.json',JSON.stringify(session));
            	res.send({'msg': 'END OF THE GAME'});

        	}else if(session.indexOf(randomNumber) < 0) {
   	     		session.push(randomNumber);
        		fs.writeFile('./numbers.json', JSON.stringify(session));
        		res.send({number: randomNumber});
    		}
    		else {
        		return generateNumber();
    		}
	    });
	}
 });


 app.post('/checkBingo', (req, res) => {
     fs.readFile('./numbers.json', 'utf-8', (err, data) => {
        if(err) throw err;
        let session;
        if(data.length) {
            session = JSON.parse(data);
		} else {
            session = [];
		}
		let player = req.body.name;
		let selectedNum = req.body.selectedNumbers;
		let numberFound = false;
		if(selectedNum.length !== 25){
      	   	res.send({'msg':'Not a winning Ticket'});
      	   	res.end();
        } else {
            for(let i =0; i < selectedNum.length ; i++){
                if(session.indexOf(selectedNum[i]) < -1){
                	numberFound = true;
                	break;
                }
            }
		}
		if(numberFound){
            res.send({'msg':'Not a winning Ticket'});
            res.end();
		} else {
            session = [];
            fs.writeFile('./numbers.json', JSON.stringify(session));
            res.send({'msg': 'has won the game'});
            res.end();
		}
	  });
 });

 function getRandomNumber(min,max) {
    	return Math.floor(Math.random()*(max-min+1)+min);
 }


 app.listen(8080, function(){
 	console.log('listening on 8080');
 })