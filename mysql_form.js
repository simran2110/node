var express = require('express');
var hbs = require('hbs');
var mysql = require('mysql');
var url = require('url');
var bp = require('body-parser');

var app = express();

var con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db'
});
app.set('viewengine','hbs');
app.use(bp.urlencoded({extended : true}));

// if user goes to root he gets form
app.get('/',(req,res)=>{
    res.render('viewform.hbs');
});

app.get('/viewtable',(req,res)=>{
    console.log("in viewtable");
    var p = "select * from catname";
            con.query(p,(err,result)=>
            {
                if(err)
                    throw err;
                else {
                  res.render('output.hbs',{
                    arr : result
                  });
                }
            });
});

//after submitting the new entry form
app.post('/submitform',(req,res)=>{
    var _catname = req.body.catname;
    var _status = req.body.status;
    
    var q = "insert into catname set catname = '"+_catname+"' , status = '"+_status+"'";
    con.query(q,(err,rows,fields)=>
    {
        if(err)
        {
            console.log('Connection not connected with mysql while insert');
            throw err;
        }
        else
        {
            res.redirect('/viewtable');    
        }
    });
});

app.get('/viewdata/:id',(req,res)=>
{
    var id = req.params.id;

    var p = "select * from catname where id="+id;
    console.log(p);
    con.query(p,(err,result)=>
    {
        if(err)
            throw err;
        else {
            var status = result[0].status;
            var catname = result[0].catname;
            
            res.render('viewdata_single.hbs',{
            catname : catname,
            status : status
            });
        }
    });
});

app.get('/updatedata/:id',(req,res)=>
{
    var id = req.params.id;
    var p = "select * from catname where id="+id;
    console.log(p);
    con.query(p,(err,result)=>
    {
        if(err)
            throw err;
        else {
            var status = result[0].status;
            var catname = result[0].catname;
            res.render('updateform.hbs',{
            catname : catname,
            status : status,
            id : id
            });
        }
    });
});

app.post('/submit_updateform/:id',(req,res)=>
{
    console.log("submitupdate called");
    var name = req.body.catname;
    var status = req.body.status;
    var id = req.params.id;
    var p = "update catname set catname = '"+name+"', status = '"+status+"'  where id= "+id;
    con.query(p,(err,result)=>
    {
        if(err)
            throw err;
        else {
            res.redirect('/viewtable');
        }
    });
});
 
app.listen(1000);

