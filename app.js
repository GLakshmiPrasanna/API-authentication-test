const express=require('express');
const bodyParser=require('body-parser');
const passport=require('passport');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const UserModel = require('./model/model');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/postsDB');

mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});





const postsSchema=new mongoose.Schema({
    title:String,
    content:String
})

const postsModel=mongoose.model('Post',postsSchema);

//All posts
app.route('/posts')
.get((req,res)=>{
    postsModel.find().then((posts)=>{
        res.send(posts);
    }
    ).catch((err)=>{
        console.log(err);
    })
})
.post((req,res)=>{
    const post=new postsModel({
        title:req.body.title,
        content:req.body.content
    })
    post.save().then(()=>{
        console.log("Successfully saved the post!");
    }).catch((err)=>{
        console.log(err);
    })
    res.redirect('/posts');
})
.delete((req,res)=>{
    postsModel.deleteMany().then((post)=>{
        if(post){
            res.send(post);
        }
        else{
            res.send("Something went wrong");
        }
        console.log("Deleted successfully!");
    }).catch((err)=>{
        console.log(err);
    })
});


//Single post
app.route('/posts/:name')
.get((req,res)=>{
    postsModel.find().then((posts)=>{
        res.send(posts);
    }
    ).catch((err)=>{
        console.log(err);
    })
})
.put((req,res)=>{
    postsModel.replaceOne({title:req.params.name},{
        title:req.body.title,
        content:req.body.content
    }).then((post)=>{
        if(post){
            res.send(post);
        }
        else{
            res.send("Something went wrong");
        }
        console.log("Replaced successfully!");
    }).catch((err)=>{
        console.log(err);
    })
})
.patch((req,res)=>{
    postsModel.updateOne({title:req.params.name},{
        $set:req.body
    }).then((post)=>{
        if(post){
            res.send(post);
        }
        else{
            res.send("Something went wrong");
        }
        console.log("Updated successfully!");
    }).catch((err)=>{
        console.log(err);
    })
})
.delete((req,res)=>{
    postsModel.deleteOne({title:req.params.name}).then((post)=>{
        if(post){
            res.send(post);
        }
        else{
            res.send("Something went wrong");
        }
        console.log("Deleted successfully!");
    }).catch((err)=>{
        console.log(err);
    })
});

app.listen(3000,()=>{
    console.log("Server started!");
})