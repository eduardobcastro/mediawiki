const { request } = require('https')

function jsonDownload(options) {
  return new Promise((resolve, reject) => {   
    let req = request(options, function (res) {
      let chunks = []
    
      res.on('data', function (chunk) {
        chunks.push(chunk)
      })
    
      res.on('end', function () {
        if (res.statusCode !== 200) {
          return reject(res.statusCode)
        }
        let str = Buffer.concat(chunks).toString()
        try {
          let obj = JSON.parse(str)
          resolve(obj)
        } catch (err) {
          reject (err)
        }
      })
    
      req.on('error', function (err) {
        reject(err)
      })
    })
    req.end()
  })
}

async function wikiSearh(term) {
  let options = {
    'method': 'GET',
    'hostname': 'www.wikidata.org',
    'path': `/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${term}`
  }
  let results = await jsonDownload(options)
  if (results.error) throw results.error
  return results
}

wikiSearh('Lisboa')
.then(results => {
  for (item of results.query.search) {
    console.log(item.snippet)
  }
})
.catch(console.error)

