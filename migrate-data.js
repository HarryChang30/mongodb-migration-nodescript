const mongodb = require('mongodb')
const async = require('async')
const customers = require('./data/m3-customer-data.json')
const customerAddress = require('./data/m3-customer-address-data.json')
const url = 'mongodb://localhost:27017/test'

let tasks = []
const limit = parseInt(process.argv[2], 10) || 1000

mongodb.MongoClient.connect(url, (err, client) => {
    if(err) return process.exit(1)
    const db = client.db('test')

    customers.forEach((customer, index, list) => {
        customers[index] = Object.assign(customer, customerAddress[index])

        if(index % limit == 0){
            const start = index
            const end = (start+limit > customers.length) ? customers.length-1: start+limit
            tasks.push((done) => {
                db.collection('test').insert(customers.slice(start,end), (err, res) => {
                    done(err, res)
                })
            })
        }
    })

    async.parallel(tasks, (err, res) => {
        if(err) console.error(err)
        console.log(res)
        client.close()
    })
})


