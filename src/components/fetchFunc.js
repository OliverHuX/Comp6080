export default async function FetchFunc (path, method, token, body) {
  return await fetch('http://localhost:5005/' + path, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: body
  })
    .catch(err => console.warn(err))
}
