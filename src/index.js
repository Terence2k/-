const express = require('express')
const bodyParse = require('body-parser')
const { readFileSync } = require('fs')
const { resolve } = require('path')


const app = express()

const myResult = []

app.use(bodyParse.urlencoded({ extended: true }))
app.use(bodyParse.json())

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Headers', 'content-type')
    res.header('Access-Control-Allow-methods', 'GET,POST')
    next()
})


app.post('/getQuestion', function (req, res) {
    const order = req.body.order
    const questionData = JSON.parse(readFileSync(resolve(__dirname, 'data/question.json'), 'utf-8'))
    const questionResult = questionData[order]
    console.log(order, req.body, questionResult, '////////////////////////////////////////////////')

    if (questionResult) {
        const { id, question, items } = questionResult
        res.send({ id, question, items })
    } else {
        res.send({
            errCode: 1,
            message: "NO_DATA",
            data: myResult
        })
        myResult = []
    }
})


app.post('/uploadAnswer', function (req, res) {
    const { order, myAnswer } = req.body
    const questionData = JSON.parse(readFileSync(resolve(__dirname, 'data/question.json'), 'utf-8'))

    const { id, question, items, answer } = questionData[order]
    myResult.push({
        qid: id,
        question,
        myAnswer: items[myAnswer],
        rightAnswer: items[answer],
        isRight: answer == myAnswer
    })

    let myTotal = myResult.filter(item => {
        console.log(item, order)
        return item.qid == order
    })

    res.send(myTotal[myTotal.length - 1])
})

app.listen(8888, function () {
    console.log('welcome to use Express on 8888')
})