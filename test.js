const getcontent = require('./getContent');

getcontent().then(data =>{
    console.log(data);
}).catch( (e)=>{
    console.log(e);
});