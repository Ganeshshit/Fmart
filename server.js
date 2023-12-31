import  express  from "express";
import dotenv from 'dotenv'
// import colors from 'colors'
import morgan from 'morgan';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoute.js'
import catagoryRoutes from './routes/catagoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import path from 'path'


// configure env
dotenv.config();

// Database config
connectDB();


// rest object 

const app=express()


// middel wares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname,'./client/build')))

//* Routes

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

// rest api /
app.get('/',(req,res)=>{
res.send("<h1> Wel come to my e website</h1>");

})
const PORT=process.env.PORT || 8000;

// run listen
app.listen(PORT,()=>{
    console.log(`sever runing ${process.env.DEV_MODE} on port${PORT}`)
})
