export default function postImage (target, hasAlbum, album, post) {//saves image to 'imgbb.com' server
  const imgName = target.value.slice(12);
  const rf = new FileReader();
  rf.readAsDataURL(target.files[0]);
  const promise = new Promise((resolve, reject) => {
    rf.onload = async function (event) {
      const body = new FormData();
      body.append('image', event.target.result.split(',').pop())
      body.append('name', imgName.slice(0, imgName.lastIndexOf('.')))
      fetch('https://api.imgbb.com/1/upload?key=432e8ddaeeb70d2d1be863e87c0f354e', { method: 'POST', body })
        .then((res) => res.json()).then((res) => {
          resolve({
            title: imgName.slice(0, imgName.lastIndexOf('.')), imageURL: res.data.url, hasAlbum, post, album
          })
        })
    }
  })
  return promise
}
