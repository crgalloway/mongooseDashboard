const express = require('express')
const app = express();

var path = require('path')

app.set('view engine', 'ejs')
app.set ('views', path.join(__dirname+'/views'))
app.use(express.static(path.join(__dirname+'/static')))

const bp = require('body-parser')
app.use(bp.urlencoded({ extended:true }))

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/dashboard');

var BeeSchema = new mongoose.Schema({
	name:{ type: String, required: true, minlength: 2, maxlength: 50},
	rank:{ type: String, required: true},
	age: Number,
	colony: String
}, {timestamps:true})
mongoose.model('Bee', BeeSchema)
var Bee = mongoose.model('Bee')

app.get('/',function(req, res){
	Bee.find().sort({createdAt:-1}).find({}, function(err, bees){
		res.render('index', {bees:bees})
	})
})
app.get('/bees/new', function(req, res){
	res.render('new')
})
app.post('/bees', function(req, res){
	var bee = new Bee({name: req.body.name, age:req.body.age, rank:req.body.rank, colony:req.body.colony});
	bee.save(function(err){
		if (err){
			console.log('something went wrong')
		} else{
			res.redirect('/')
		}
	})
})
app.get('/bees/:id', function(req, res){
	Bee.find({_id: req.params.id}, function(err,bee){
		res.render('bee', {bee: bee})
	})
})
app.get('/bees/edit/:id', function(req, res){
	Bee.find({_id: req.params.id}, function(err,bee){
		res.render('edit', {bee: bee})
	})
})
app.post('/bees/:id', function(req, res){
	Bee.update({_id: req.params.id}, {name: req.body.name, age:req.body.age, rank:req.body.rank, colony:req.body.colony}, function(err){
		if (err){
			res.redirect('/bees/edit/'+req.params.id)
		}
		else{
			res.redirect('/')
		}
	})
})
app.get('/bees/destroy/:id', function(req,res){
	Bee.remove({_id: req.params.id}, function(err){
		res.redirect('/')
	})
})

app.listen(8000, function() {
	console.log("listening on port 8000");
})