const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main',(req,res)=>{
  console.log(req.session.currentUserId)
  
  if(req.session.currentUserId){
    res.render('main')
  }else{
    res.render('not-registred')
  }
})

router.get('/private',(req,res)=>{
  if(req.session.currentUserId) res.render('private')
  else res.render('not-registred')
})

module.exports = router;
