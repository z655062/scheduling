import express from "express";
import passport from "passport";
import googleAuth from "passport-google-oauth20";
import lineAuth from "passport-line-auth";
import expressSession from "express-session";

const GoogleStrategy = googleAuth.Strategy;
const LineStrategy = lineAuth.Strategy;

passport.use(new GoogleStrategy({
    // clientID: "714526822821-v92legl2mokolrejkso5gg08jg3o2h5c.apps.googleusercontent.com",
    clientID: "714526822821-9ga0k0dauj3pi3gkunqff49su26ptm3j.apps.googleusercontent.com",
    // clientSecret: "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",
    clientSecret: "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",
    callbackURL: "https://2c54d2268c6f.ngrok-free.app/api/auth/google/callback"
},
    (accessToken, refreshToken, profile, cb) => {
        return cb("test err", profile);
    }
));



passport.use(new LineStrategy({
    channelID: "2008308071",
    channelSecret: "87577f8a7e74a1216438197c8b957cf9",
    callbackURL: "https://2c54d2268c6f.ngrok-free.app/api/auth/line/callback",
    scope: ['profile', 'openid', 'email'],
    botPrompt: 'normal',
    uiLocales: 'zh-tw',
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(accessToken, refreshToken, profile)
        return cb("line", profile);
    }
));


const router = express.Router();
router.use(expressSession({ secret: 'keyboard dog', resave: true, saveUninitialized: true }));

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
    // res.status(200).json({});
});



router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile', 'openid'],
}));


router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    console.log(req, res)
    res.send({
        status: true,
        data: {
            id: req.user.id,
            name: req.user.displayName
        }
    });
})

router.get('/line', passport.authenticate('line'));


router.get('/line/callback', passport.authenticate('line', { session: false }), (req, res) => {
    console.log(req, res)
    res.send({
        status: true,
        data: {
            id: req.user.id,
            name: req.user.displayName
        }
    });
})


export default router;
