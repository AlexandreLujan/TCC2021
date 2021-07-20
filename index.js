// index.js
//---------------------------------------------------------------------------------------------------------------
/**
 * Required External Modules
 */
 if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require("express")
const path = require("path")
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);
const users = []
async function tobias(){
  const hashedPassword = await bcrypt.hash("b", 10)
    users.push({
      id: Date.now().toString(),
      name: "b",
      email: "b@b.com",
      password: hashedPassword
    })
}
tobias()
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
/**
 * App Variables
 */
const app = express()
const port = process.env.PORT || "8000"
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
/**
 *  App Configuration
 */
 app.set("views", path.join(__dirname, "views"))
 app.use(express.static(path.join(__dirname, "public")))
 app.use(express.urlencoded({ extended: false }))
 app.use(flash())
 app.use(passport.initialize())
 app.use(passport.session())
 app.use(methodOverride('_method'))
 app.engine('html', require('ejs').renderFile)
 app.set('view engine', 'html')

 app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
 }))
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
/**
 * Routes Definitions
 */
 app.get("/", (req, res) => {
    res.render("index", { title: "Home" })
 })

 app.get("/user_space", checkAuthenticated, (req, res) => {
    res.render("user_space", { name: req.user.name  })
 })

 app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", { title: "Log In" })
 })

 app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register", { title: "Create Account" })
 })

 app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/user_space',
  failureRedirect: '/login',
  //failureFlash: true
}))

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("checkAuthenticated = sucess")
    return next()
  }
  console.log("checkAuthenticated = fail")
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/user_space')
  }
  next()
}
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`)
})
//---------------------------------------------------------------------------------------------------------------