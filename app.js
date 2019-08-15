const express =require('express');
const app=express();
const morgan =require('morgan');
const bodyParser =require('body-parser');
const mongoose =require('mongoose');
const cors=require('cors');

const productRoutes =require('./routes/products');
const uri ='mongodb://m001-student:'+process.env.MONGO_ATLAS_PW+'@cluster1-shard-00-01-apx3g.mongodb.net:27017,cluster1-shard-00-00-apx3g.mongodb.net:27017,cluster1-shard-00-02-apx3g.mongodb.net:27017/test?ssl=true&replicaSet=Cluster1-shard-0&authSource=admin&retryWrites=true&w=majority';
//const uri ='mongodb://localhost/FoodHousie';
mongoose.connect(
            uri,
            {            useNewUrlParser: true  }
            );
            //console.log(mongoose.connection.readyState);
mongoose.Promise=global.Promise;
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb',extended:false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,Accept,Authorization'
    );
    if(req.method==='OPTIONS'){
     res.header('Access-Control-Allow-Methods',
     'PUT POST PATCH DELETE GET');
     return res.status(200).json({});
    }
      next();
});

app.use('/products',productRoutes);
app.use((req,res,next)=>{
    const error=new Error("Not Found");
    error.status=400;
    next(error);
});

app.use((error,req,res,next)=>{
      res.status(error.status || 500);
      res.json({
          error:{
              message:error.message
          }
      });
      
});
 module.exports=app;