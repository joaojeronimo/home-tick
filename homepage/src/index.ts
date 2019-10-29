import config from './config'

const main = async () => {
  const res = await fetch(`https://api.${config.tld}/initial-payload`)
  const body = await res.json()
  document.body.innerHTML = JSON.stringify(body, null, 2)
}

main().catch(err => {
  console.error(err)
})
