require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler= require('errorhandler')
const bodyParser = require ('body-parser')
const methodOverride = require ('method-override')

const port = 3000
const app = express()
const path = require('path')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded)({ extended: false})
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

const initApi = req => {
  return Prismic.getGraphQLEndpoint(process.env.PRISMIC_ENDPOINT,{
    accessToken: process.env.PRISMIC_ACCESS_TOKENN,
    req
  })
}

const handleLinkResolver = doc => {
  if(doc.type === 'product') {
    return '/details/${doc.slug}'
  }
  if(doc.type === 'ourStaff') {
    return '/ourStaff}'
  }
  if(doc.type === 'about') {
    return '/about'
  }

  return '/'
}

app.use((req,res,next) => {
  res.locals.link = handleLinkResolver

  res.locals.Numbers = index => {
    return index == 0 ? 'One' : index == 1 ? 'Two': index == 2 ? 'Three' : index == 3 ? 'Four' : '';
  }

  res.locals.PrismicDOM = PrismicDOM

  next()
})



app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'pug')

app.get('/', (req,res) => {
  res.render('pages/home')

})

app.get('/about', (req,res) => {
  res.render('pages/about')

})

app.get('/details/:', (req,res) => {
  res.render('pages/collections')

})

app.get('/details/:', (req,res) => {
  res.render('pages/detail')

})

app.listen(port, () => {
  console.log('Example app listening at http://localhost:3000')
})



