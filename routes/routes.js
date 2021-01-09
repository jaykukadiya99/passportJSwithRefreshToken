const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup', passport.authenticate('signup', { session: false }), async(req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
});

router.post('/login', async(req, res, next) => {
    passport.authenticate('login', async(err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An Error occurred')
                return next(error);
            }
            req.login(user, { session: false }, async(error) => {
                if (error) return next(error)
                const body = { _id: user._id, email: user.email };            
                const token = jwt.sign({ user: body }, 'top_secret',{expiresIn:60});   
                const rToken = jwt.sign({ user: body }, 'r_Key',{expiresIn:300});

                const response = { token , rToken};

                // console.log(tokenList);
                return res.json(response);
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.get('/rToken', passport.authenticate('refresh', { session: false }),(req,res,next)=>{
    // console.log("in rToken got");
    // console.log(req.user);
    const token = jwt.sign({ user: req.user }, 'top_secret',{expiresIn:60});   
    // console.log(t1);
    return res.json({msg:"new token",user:req.user,token});
});

module.exports = router;