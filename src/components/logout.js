import FetchFunc from './fetchFunc';

export default function Logout () {
  const token = localStorage.getItem('token');
  token && FetchFunc('admin/auth/logout', 'POST', token, null)
    .then((data) => {
      if (data.status === 200) {
        console.log('Logged out!');
        localStorage.clear();
        window.location.href = '/';
      } else {
        data.json().then(result => {
          console.log(result.error);
        })
      }
    })
}
