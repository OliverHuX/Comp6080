import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');
// const token = localStorage.getItem('token');
const token = get_token_fromLocal();
var currentUserToekn;
var counter = 0;
// use for checking is there any person u follow has post an img
var check_counter = 0;
var total_post = 0;
var currentUserId = localStorage.getItem('id');
var currentUser = localStorage.getItem('username');
console.log(token);
console.log(currentUser);

// localStorage.clear(); // this is for clear the local storage

// this is for checking the user is already login or not
// token will expire in 10mins once log in
if (token) {
    var timer2 = setInterval(update_total_count(token, currentUserId), 1000)
    setTimeout(() => {clearInterval(timer2)}, 11000)
    currentUserToekn = token;
    count_total_post(token, currentUserId);
    load_header(token, currentUser);
    load_feed(token, null, null)
    document.getElementById('feed pad').style.display="block"
}

function store_token_withExpiry(token, ttl) {
    // the unit of ttl is milisec => 1 sec == 1000 ms
    // ttl is converted to minutes
    const time = new Date();
    const token_item = {
        'token': token,
        'expiry': time.getTime() + ttl*1000*60,
    }
    localStorage.setItem('item', JSON.stringify(token_item));
}

// get the token from local storage
// and check the expiry
function get_token_fromLocal() {
    var item = localStorage.getItem('item');
    if (item) {
        item = JSON.parse(item);
        const time = new Date();
        if (time.getTime() >= item.expiry) {
            localStorage.clear();
        } else {
            return item.token;
        }
    }
    return null;
}

// ================================ Authentication Services ================================ //
// this is login function
function login() {
    const loginBody = {
        "username": document.getElementById('username').value,
        "password": document.getElementById('password').value,
    };

    const confirmPassword = document.getElementById('confirm').value
    if (confirmPassword != loginBody.password) {
        errPopup('login pad' ,"The two passwords don't match, try again!")
    } else {
        const result = fetch('http://localhost:5000/auth/login', {
            method :'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginBody),
        }).then((data) => {
            if (data.status === 403) {
                errPopup('login pad' ,"Username or password is incorrect")
            } else if (data.status === 200) {
                data.json().then(r => {
                    console.log(r.token);
                    // store the token
                    // using for refresh
                    localStorage.setItem('username', loginBody.username);
                    store_token_withExpiry(r.token, 10);
                    currentUserToekn = r.token;
                    currentUser = localStorage.getItem('username');

                    const result = fetch('http://localhost:5000/user', {
                        method :'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + r.token
                        },
                    }).then((data) => {
                        if (data.status === 400) {
                            errPopup('feed pad', 'Malformed Request')
                        } else if (data.status === 403) {
                            errPopup('feed pad', 'Invalid Auth Token')
                        } else if (data.status === 404) {
                            errPopup('feed pad', 'User Not Found')
                        } else if (data.status === 200) {
                            data.json().then(data => {
                                localStorage.setItem('id', data.id);
                                currentUserId = data.id;
                                count_total_post(r.token, data.id);
                                console.log(data.id)
                            })
                        }
                    })
                    load_header(r.token, loginBody.username);
                    load_feed(r.token, null, null)
                })
                // once login the feed screen will appear
                document.getElementById('feed pad').style.display="block"
            }
        })
    }
    // console.log(loginBody);
    // console.log(currentUser);
};

// this register function
function register() {
    const signBody = {
        "username": document.getElementById('new-username').value,
        "password": document.getElementById('new-password').value,
        "email": document.getElementById('email').value,
        "name": document.getElementById('name').value
    };

    const confirmPassword = document.getElementById('new-confirm').value
    if (confirmPassword != signBody.password) {
        errPopup('register pad' ,"The two passwords don't match, try again!")
    } else {
        const result = fetch('http://localhost:5000/auth/signup', {
            method :'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signBody),
        }).then((data) => {
            if (data.status === 400) {
                errPopup('register pad' ,"Missing Username or password")
            } else if (data.status === 200) {
                data.json().then(result => {
                    console.log(result.token)

                    localStorage.setItem('username', signBody.username);
                    store_token_withExpiry(result.token, 10);
                    currentUserToekn = result.token;
                    currentUser = localStorage.getItem('username');

                    const r = fetch('http://localhost:5000/user', {
                        method :'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + result.token
                        },
                    }).then((data) => {
                        if (data.status === 400) {
                            errPopup('feed pad', 'Malformed Request')
                        } else if (data.status === 403) {
                            errPopup('feed pad', 'Invalid Auth Token')
                        } else if (data.status === 404) {
                            errPopup('feed pad', 'User Not Found')
                        } else if (data.status === 200) {
                            data.json().then(data => {
                                localStorage.setItem('id', data.id);
                                currentUserId = data.id;
                                // console.log(data.id)
                                // console.log(result.token)
                                // this function count the total post of the user who the current user follows 
                                count_total_post(result.token, data.id);
                            })
                        }
                    })
                    // show the current user name at the top
                    // show the functions of make post and follow
                    load_header(result.token, signBody.username);
                    // show the post of person who the current user follows
                    load_feed(result.token, null, null)
                    const parent = document.getElementById('feed pad');
                    document.getElementById('register pad').style.display="none"
                    parent.style.display="block"
                    // pop up the info if the user haven't followed someone
                    success_info('You haven\'t followed anyone!<br>Please follow someone!')
                })
            }
        })
    }
}
// ================================ end ================================ //

// ================================ User Information Services ================================ //

function get_user_info(token, username, id) {
    var url;
    if (username == null && id == null) {
        url = 'http://localhost:5000/user';
    } else if (id == null) {
        url = 'http://localhost:5000/user?username=' + username;
    } else {
        url = 'http://localhost:5000/user?id=' + id;
    }
    const result = fetch(url, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'User Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                const partent = document.getElementById('user info');
                // post modal
                const post_pad = document.getElementById('post detail');
                const container = document.createElement('div');
                container.className = 'modal-content';
                // close button
                var close = document.createElement('span');
                close.className = 'close';
                close.innerHTML = '&times;'
                close.addEventListener('click', () => {
                    partent.style.display = 'none';
                    partent.removeChild(close);
                    partent.removeChild(container);
                    partent.removeChild(unfollow_btn);
                    partent.removeChild(edit_btn);
                });
                var newline = document.createElement('br');
                partent.appendChild(close);
                container.appendChild(newline);
                var user_name = document.createElement('p');
                var name = document.createElement('p');
                var id = document.createElement('p');
                id.id = data.username;

                // info of author and current user
                var email = document.createElement('p');
                var following = document.createElement('p');
                var followed_num = document.createElement('p');
                var posts = document.createElement('div');
                user_name.innerHTML = 'username: ' + data.username;
                name.innerHTML = 'name: ' + data.name;
                id.innerHTML = 'id: ' + data.id;
                email.innerHTML = 'email: ' + data.email;
                following.innerHTML = 'following: \n';
   
                var i = 0;
                data.following.map(person => {
                    get_following_name(token, person, following, i);
                    i++;
                })
                followed_num.innerHTML = 'following num:' + data.followed_num;
                posts.innerHTML = 'Posts: ';
                var str_name = user_name.innerText.split(" ")[1];
                i = 0;
                data.posts.map(post => {
                    // show the post when user click check post button
                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    var p = document.createElement('p');
                    p.style.marginLeft = '30%'
                    var edit = document.createElement('p');
                    // edit is the button
                    edit.innerHTML = "Check post";
                    edit.className = 'info-click';
                    edit.style.marginLeft = '10%';
                    p.innerHTML = i + ': ' + post;
                    edit.addEventListener('click', () => {
                        partent.style.display = 'none';
                        post_pad.style.display = 'block';
                        get_post(token, post, str_name);
                    })
                    
                    container.appendChild(p);
                    container.appendChild(edit);
                    posts.appendChild(container);
    
                    i++;
                })


                container.appendChild(user_name);
                container.appendChild(name);
                container.appendChild(id);
                container.appendChild(email);
                container.appendChild(following);
                container.appendChild(followed_num);
                container.appendChild(posts);

                partent.appendChild(container);
                // unfollow button
                const unfollow_btn = document.createElement('button');
                unfollow_btn.className = 'post-btn';
                unfollow_btn.style.backgroundColor = 'red';
                unfollow_btn.innerHTML = 'Unfollow';
                unfollow_btn.addEventListener('click', () => {
                    unfollow(str_name, token);
                    partent.style.display = 'none';
                    partent.removeChild(close);
                    partent.removeChild(container);
                    partent.removeChild(edit_btn);
                    partent.removeChild(unfollow_btn);
                })
                unfollow_btn.style.display = 'none';
                partent.appendChild(unfollow_btn);
                // update profile
                const edit_btn = document.createElement('button');
                edit_btn.innerHTML = 'Update profile';
                edit_btn.className = 'post-btn';
                edit_btn.style.display = 'none';

                edit_btn.addEventListener('click', () => {
                    partent.removeChild(container);
                    partent.removeChild(unfollow_btn);
                    partent.removeChild(close);
                    // close button
                    const close_profile = document.createElement('span');
                    close_profile.className = 'close';
                    close_profile.innerHTML = '&times;'
                    close_profile.addEventListener('click', () => {
                        partent.removeChild(h);
                        partent.removeChild(emailInput);
                        partent.removeChild(nameInput);
                        partent.removeChild(pwInput);
                        partent.removeChild(submit);
                        partent.removeChild(close_profile);
                        partent.style.display = 'none';
                    })
                    partent.appendChild(close_profile);
                    // profile screen
                    const h = document.createElement('h1')
                    h.className = 'modal-font';
                    h.innerHTML = 'Update your profile';
                    partent.appendChild(h);
                    const emailInput = document.createElement('input');
                    emailInput.type = 'email';
                    emailInput.className = 'input-size';
                    emailInput.placeholder = 'Email';
                    partent.appendChild(emailInput);
                    
                    const nameInput = document.createElement('input');
                    nameInput.type = 'text';
                    nameInput.className = 'input-size';
                    nameInput.placeholder = 'Name';
                    partent.appendChild(nameInput);
                    
                    const pwInput = document.createElement('input');
                    pwInput.type = 'text';
                    pwInput.className = 'input-size';
                    pwInput.placeholder = 'Password';
                    partent.appendChild(pwInput);
                    // submit button
                    // addlistener
                    // make payload
                    // call update_info() function

                    const submit = document.createElement('button');
                    submit.innerHTML = 'Sumbit';
                    submit.className = 'post-btn';
                    submit.addEventListener('click', () => {
                        update_info(token, emailInput.value, nameInput.value, pwInput.value);
                    })

                    partent.appendChild(submit);  
                    partent.removeChild(edit_btn);
                })

                partent.appendChild(edit_btn);
                // check if the user click themselves, then update profile button comes out
                // if not, unfollow button comes out
                if (currentUser == str_name) {
                    edit_btn.style.display = 'block';
                } else if(currentUser != str_name) {
                    unfollow_btn.style.display = 'block';
                }
            })
        }
    })
}

// load the post of person who the current user follows
function load_feed(token, p, n) {
    if (p === null) {
        p = 0
    }
    if (n === null) {
        n = 10
    }
    console.log(p)
    console.log('Loading feed');
    const result = fetch('http://localhost:5000/user/feed?p='+p+'&n='+n, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((result) => {
        if(result.status === 403) {
            errPopup('feed pad' ,"Invalid Auth Token")
        } else if(result.status === 200) {
            result.json().then(data => {
                const posts = data.posts
                counter += posts.length;
                // console.log(data)
                const modal = document.getElementById('modal pad');
                var newline = document.createElement('br')
                posts.map(post => {
                    const partent = document.getElementById('feed pad');

                    // box will contain the feed, it's like ID card
                    const box = document.createElement('div');
                    box.className = 'post-box';

                    const authbox = document.createElement('h1');
                    authbox.className = 'info-click';
                    authbox.innerHTML = 'By \n' + post.meta.author;
                    // show the info of author
                    authbox.addEventListener('click', () => {
                        get_user_info(token, post.meta.author, null);
                        document.getElementById('user info').style.display="block";
                    })

                    box.appendChild(authbox);

                    // contains the post
                    const testbox = document.createElement('div');
                    testbox.className = 'post-box';
                    testbox.innerText = 'post is \n' + post.meta.description_text;
                    box.appendChild(testbox);

                    // contains the image
                    const imgbox = document.createElement('img');
                    imgbox.className = 'image-block';
                    imgbox.setAttribute('src', 'data:image/jpeg;base64,' + post.thumbnail);
                    box.appendChild(imgbox);

                    // this for current user make new post
                    const textarea = document.createElement('textarea');
                    textarea.className = 'textarea';
                    textarea.placeholder = 'Make new comments'
                    const commentclose = document.createElement('span')
                    commentclose.className = 'close'
                    commentclose.innerHTML = '&times;'
                    commentclose.addEventListener('click', () => {
                        modal.removeChild(commentclose);
                        modal.removeChild(newline);
                        modal.removeChild(textarea);
                        modal.removeChild(submit);
                        modal.style.display = 'none';
                    })
                    // make new post
                    const submit = document.createElement('button');
                    submit.className = 'post-btn';
                    submit.innerHTML = 'Submit';
                    submit.addEventListener('click', () => {
                        post_comment(token, textarea.value, post.id);
                        textarea.innerHTML = "";
                    })

                    // make comments button
                    const comment_btn = document.createElement('button');
                    comment_btn.innerHTML = 'Make comments';
                    comment_btn.addEventListener('click', () => {
                        modal.appendChild(commentclose);
                        modal.appendChild(newline);
                        modal.appendChild(textarea);
                        modal.appendChild(submit);
                        modal.style.display = 'block';
                    })

                    box.appendChild(comment_btn);

                    // likes button
                    const like_icon = document.createElement('i');
                    // check user id by token
                    // if the user id in the likes list
                    // then initial the class of icon as 'fa fa-thumbs-down'
                    like_icon.id = post.id
                    var flag = false
                    post.meta.likes.map(like => {
                        if (like == currentUserId) {
                            flag = true;
                        }
                    })
                    if (flag) {
                        console.log('true')
                        like_icon.className = 'fa fa-thumbs-up';
                        like_icon.classList.toggle("fa-thumbs-down");
                        like_icon.title = 'dislikes'
                    } else {
                        console.log('false')
                        like_icon.className = 'fa fa-thumbs-up';
                        like_icon.title = 'likes'
                    }
                    like_icon.style.display = 'block'
                    like_icon.addEventListener('click', () => {
                        const id = like_icon.id;
                        // check likes or dislikes
                        if (like_icon.title == 'likes') {
                            like_comment(token, id);
                        } else {
                            dislike_comment(token, id);
                        }

                    })
                    box.appendChild(like_icon);
                    // contains the published time
                    const timebox = document.createElement('div');
                    timebox.className = 'post-box';
                    timebox.innerText = 'time is \n' + convertTime(post.meta.published);
                    box.appendChild(timebox);

                    const likebox = document.createElement('div');
                    likebox.className = 'post-box';
                    likebox.id = "likebox" + post.id;
                    likebox.innerText = 'The number of like: ' + post.meta.likes.length;
                    // show likes button
                    const showbtn = document.createElement('button');
                    showbtn.innerHTML = 'Show likes'
                    showbtn.addEventListener('click', () => {
                        get_likes(token, post.id)
                        modal.style.display = 'block';
                    })

                    box.appendChild(likebox);
                    box.appendChild(showbtn);

                    const combox = document.createElement('div');
                    combox.className = 'post-box';
                    combox.id = "combox" + post.id;
                    combox.innerText = 'The number of comments: ' + post.comments.length;
                    // this is the comment list, it contains comments
                    const comlist = document.createElement('div');
                    comlist.className = 'modal';
                    const newclose = document.createElement('span')
                    newclose.className = 'close'
                    newclose.innerHTML = '&times;'
                    comlist.appendChild(newclose)
                    newclose.addEventListener('click', () => {
                        comlist.style.display = 'none'
                    });
                    
                    // show comments button
                    const showbutton = document.createElement('button');
                    showbutton.innerHTML = 'Show comments'
                    showbutton.addEventListener('click', () => {
                        get_comments(token, post.id);
                        modal.style.display = 'block'
                    })
                    
                    box.appendChild(combox);
                    box.appendChild(showbutton);
                    partent.appendChild(box)
                })
            })
        }
    })
}

// this function is for load header
// it contains make new post, info of current user and follow function
function load_header(token, user) {

    document.getElementById('login pad').style.display="none"
    console.log(token);
    const parent = document.getElementById('feed pad');
    const info = document.createElement('div');
    var username = document.createElement('h1');
    username.innerText = user;
    username.className = 'info-click';
    username.addEventListener('click', () => {
        get_user_info(token, null, null);
        document.getElementById('user info').style.display="block";
    })
    info.appendChild(username);
    parent.appendChild(info)

    const container = document.createElement('div');
    container.style.display = 'flex';
    const leftbox = document.createElement('div');
    leftbox.className = 'lefthalf';
    const rightbox = document.createElement('div');
    rightbox.className = 'righthalf';

    const follow_section = document.createElement('div');
    follow_section.style.display = 'flex';
    const username_section = document.createElement('input');
    username_section.type = 'text';
    const follow_button = document.createElement('button');
    follow_button.innerHTML = 'follow';
    follow_button.addEventListener('click', () => {
        follow(username_section.value, token);
        const notify = document.getElementById('notify');
        if (notify != null) {
            parent.removeChild(notify);
        }
    })

    const postbtn = document.createElement('button');
    postbtn.innerHTML = 'New Post'

    const close = document.createElement('span')
    close.className = 'close'
    close.innerHTML = '&times;'
    const modal = document.getElementById('modal pad');
    const header = document.createElement('h1');
    header.style.color = 'white';
    header.innerHTML = 'Add New Post'

    const header2 = document.createElement('h2');
    header2.innerHTML = 'Choose the file image you wish to post!'
    header2.style.color = 'white';
    const file = document.createElement('input');
    file.type = 'file';
    file.id = 'file1'
    file.className = 'file-chosen';

    const img1 = document.createElement('img');
    img1.src = ""
    img1.style.height = '200px';
    img1.style.width = '200px';
    img1.style.marginTop = '10px';
    img1.id = 'img1'
    img1.alt = 'image perview';
    file.addEventListener('change', () => previewFile());

    const postarea = document.createElement('textarea');
    postarea.className = 'textarea';
    postarea.placeholder = 'Add new post'
    const newline = document.createElement('br');

    const submit = document.createElement('button');
    submit.className = 'post-btn';
    submit.innerHTML = 'Post';

    postbtn.addEventListener('click', () => {
        modal.appendChild(close);
        modal.appendChild(newline);
        modal.appendChild(header);
        modal.appendChild(newline);
        modal.appendChild(newline);
        modal.appendChild(header2);
        modal.appendChild(newline);
        modal.appendChild(file);
        modal.appendChild(img1);
        modal.appendChild(newline);
        modal.appendChild(postarea);
        modal.appendChild(submit);
        modal.style.display = 'block';
    })

    submit.addEventListener('click', () => {
        const text = postarea.value;
        console.log(file.type)
        const f = document.getElementById('file1').files[0];
        console.log(f.type)
        if (text && f) {
            var promise = fileToDataUrl(f);
            console.log(promise);

            promise.then(data => {
                var url = data.split(',')[1];
                const payload = {
                    "description_text": text,
                    "src": 
                    url,
                }
                console.log(payload);
                new_post(token, payload);
            })
            modal.removeChild(close);
            modal.removeChild(newline);
            modal.removeChild(header);
            modal.removeChild(file);
            modal.removeChild(img1);
            modal.removeChild(header2);
            modal.removeChild(postarea);
            modal.removeChild(submit);
            modal.style.display = 'none';
        }
    })

    close.addEventListener('click', () => {
        modal.removeChild(close);
        modal.removeChild(newline);
        modal.removeChild(header);
        modal.removeChild(file);
        modal.removeChild(img1);
        modal.removeChild(header2);
        modal.removeChild(postarea);
        modal.removeChild(submit);
        modal.style.display = 'none';
    })


    container.appendChild(leftbox);
    container.appendChild(rightbox);
    follow_section.appendChild(username_section);
    follow_section.appendChild(follow_button);
    leftbox.appendChild(postbtn);
    rightbox.appendChild(follow_section);
    parent.appendChild(container);
}

function update_info(token, email, name, password) {
    const payload = {
        "email": email,
        "name": name,
        "password": password,
    }
    const result = fetch('http://localhost:5000/user', {
        method :'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify(payload),
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            // should log out
            const partent = document.getElementById('user info');
            partent.textContent = "";
            partent.style.display = "none";
            localStorage.clear();
            log_out();
        }
    })
}

function follow(username, token) {
    const result = fetch('http://localhost:5000/user/follow?username=' + username, {
        method :'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'User Not Found')
        } else if (data.status === 200) {
            success_info('Success');
        }
    })
}

function unfollow(username, token) {
    const result = fetch('http://localhost:5000/user/unfollow?username=' + username, {
        method :'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 200) {
            success_info('Success');
        }
    })
}
// ================================ end ================================ //

// ================================ Post Services ================================ //

// post/like
function like_comment(token, id) {

    const result = fetch('http://localhost:5000/post/like?id='+id, {
        method :'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            var num = document.getElementById("likebox" + id).innerText.split(': ')[1];
            console.log(num)
            // milestone 6 - Live Update
            document.getElementById("likebox" + id).innerText = "The number of like: " + (parseInt(num) + 1);
            const like_icon = document.getElementById(id);
            like_icon.classList.toggle("fa-thumbs-down");
            like_icon.title = 'dislikes'
        }
    })

}
// post/unlike
function dislike_comment(token, id) {

    const result = fetch('http://localhost:5000/post/unlike?id='+id, {
        method :'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            var num = document.getElementById("likebox" + id).innerText.split(': ')[1];
            // milestone 6 - Live Update
            document.getElementById("likebox" + id).innerText = "The number of like: " + (parseInt(num) - 1);
            const like_icon = document.getElementById(id);
            like_icon.classList.toggle("fa-thumbs-down");
            like_icon.title = 'likes'
        }
    })

}

function post_comment(token, comment, id) {
    const payload = {
        "comment": comment,
    }
    const result = fetch('http://localhost:5000/post/comment?id=' + id, {
        method :'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify(payload),
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            // show success
            const parent = document.getElementById('modal pad');
            const combox = document.getElementById("combox"+id);
            const str = combox.innerText.split(": ");
            // milestone 6 - Live Update
            combox.innerText = str[0] + ": " + (parseInt(str[1]) + 1);
            parent.textContent = "";
            parent.style.display = 'none'
            success_info('Success');
        }
    })
}

function new_post(token, payload) {
    const result = fetch('http://localhost:5000/post', {
        method :'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify(payload),
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request / Image could not be processed')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 200) {
            success_info('Success');
        }
    })
}

function update_post(token, payload, id) {
    const result = fetch('http://localhost:5000/post?id=' + id, {
        method :'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify(payload),
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request / Image could not be processed')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token / Unauthorized to edit Post')
        } else if (data.status === 404) {
                errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            success_info('Success');
        }
    })
}

function delete_post(token, id) {
    const result = fetch('http://localhost:5000/post?id=' + id, {
        method :'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
                errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            success_info('Success');
        }
    })
}

function get_post(token, id, username) {
    const result = fetch('http://localhost:5000/post?id=' + id, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
                errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                const parent = document.getElementById('post detail');
                const user_pad = document.getElementById('user info');
                // close button
                const close = document.createElement('span')
                close.className = 'close'
                close.innerHTML = '&times;'
                close.addEventListener('click', () => {
                    parent.removeChild(close);
                    parent.removeChild(textarea);
                    parent.removeChild(imgbox);
                    parent.removeChild(update_btn);
                    parent.removeChild(delete_btn);
                    parent.style.display = 'none';
                    user_pad.textContent = '';
                })

                const textarea = document.createElement('textarea');
                textarea.className = 'textarea';

                const imgbox = document.createElement('img');
                imgbox.className = 'image-block';
                
                const update_btn = document.createElement('button');
                update_btn.className = 'post-btn';
                update_btn.innerHTML = 'Update';
                update_btn.addEventListener('click', () => {
                    const payload = {
                        "description_text": textarea.value,
                        "src": data.src,
                    }
                    update_post(token, payload, data.id);
                })
                
                // current user delete their post
                const delete_btn = document.createElement('button');
                delete_btn.className = 'post-btn';
                delete_btn.style.backgroundColor = 'red';
                delete_btn.innerHTML = 'Delete';
                delete_btn.addEventListener('click', () => {
                    delete_post(token, data.id);
                    parent.removeChild(close);
                    parent.removeChild(textarea);
                    parent.removeChild(imgbox);
                    parent.removeChild(update_btn);
                    parent.removeChild(delete_btn);
                    parent.style.display = 'none';
                    user_pad.textContent = "";
                });
                
                textarea.innerHTML = data.meta.description_text;
                imgbox.setAttribute('src', 'data:image/jpeg;base64,' + data.thumbnail);

                parent.appendChild(close);
                parent.appendChild(textarea);
                parent.appendChild(imgbox);
                parent.appendChild(update_btn);
                parent.appendChild(delete_btn);

                // this is checking if the post is not made by current user
                // it will only show the post detail and hidden the delete button
                if (username != currentUser) {
                    delete_btn.style.display = 'none';
                    update_btn.style.display = 'none';
                    textarea.disabled = true;
                    textarea.setAttribute('style', 'background: white !important')
                }
            })

        }
    })
}

// ================================ end ================================ //

// ================================ helper function ================================ //

function log_out() {
    // initialise everything
    const login_screen = document.getElementById('login pad');
    const feed = document.getElementById('feed pad');
    const modal = document.getElementById('modal pad');
    const info = document.getElementById('user info');
    const post = document.getElementById('post detail');
    feed.textContent = "";
    modal.textContent = "";
    info.textContent = "";
    post.textContent = "";
    login_screen.style.display = "block";
}

// pop up success info
function success_info(info) {
    const main = document.getElementById('main');
    const successPop = document.createElement('div');
    successPop.className = 'success-modal';
    const h = document.createElement('h1');
    h.innerHTML = info
    const close = document.createElement('span')
    close.className = 'success-close'
    close.innerHTML = '&times;'
    close.addEventListener('click', () => {
        main.removeChild(successPop);
    });
    var newline = document.createElement('br');
    successPop.appendChild(close);
    successPop.appendChild(newline);
    successPop.appendChild(h);
    main.appendChild(successPop);
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
// this is a preview when upload an image
function previewFile() {
    const preview = document.getElementById('img1');
    const file1 = document.getElementById('file1').files[0];
    const reader1 = new FileReader();

    reader1.addEventListener("load", () => {
    // convert image file to base64 string
    preview.src = reader1.result;
    }, false);

    if (file1) {
    reader1.readAsDataURL(file1);
    }
}

// convert user id into user name
// and show in likes modal
function get_likes(token, id) {
    const result = fetch('http://localhost:5000/post?id=' + id, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
                errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                const parent = document.getElementById('modal pad');
                const close = document.createElement('span')
                close.className = 'close'
                close.innerHTML = '&times;'
                close.addEventListener('click', () => {
                    parent.textContent = '';
                    parent.style.display = 'none';
                })
                parent.appendChild(close)
                const person = document.createElement('div')
                person.className = 'modal-font'
                const h1 = document.createElement('h1');
                h1.innerHTML = "People likes your post:";
                person.appendChild(h1)
                parent.appendChild(person)
                data.meta.likes.map(like => {
                    get_name(token, like);
                })
            })
        }
    })
}

// convert user id into user name
// and show in comments modal
function get_comments(token, id) {
    const result = fetch('http://localhost:5000/post?id=' + id, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
                errPopup('feed pad', 'Post Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                const parent = document.getElementById('modal pad');
                const close = document.createElement('span')
                close.className = 'close'
                close.innerHTML = '&times;'
                close.addEventListener('click', () => {
                    parent.textContent = '';
                    parent.style.display = 'none';
                })
                parent.appendChild(close)
                data.comments.map(c => {
                    const com = document.createElement('div');
                    com.className = 'modal-font';
                    var newline = document.createElement('br')
                    var auth = document.createElement('p');
                    var published = document.createElement('p');
                    var comment = document.createElement('p');
                    auth.innerHTML = "Author: " + c.author;
                    published.innerHTML = "Time: " + convertTime(c.published);
                    comment.innerHTML = "Comment: " + c.comment;
                    com.appendChild(auth);
                    com.appendChild(published);
                    com.appendChild(comment);
                    parent.appendChild(newline);
                    parent.appendChild(com);
                })
            })
        }
    })
}

// convert user id into user name
// and show in user info
function get_following_name(token, id, p, i) {
    const url = 'http://localhost:5000/user?id=' + id;
    const result = fetch(url, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'User Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                p.innerHTML += '<br>' + i + ': ' + data.username + '\n';
            })
        }
    })
}

// convert user id into user name
function get_name(token, id) {
    const url = 'http://localhost:5000/user?id=' + id;
    const result = fetch(url, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'User Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                const parent = document.getElementById('modal pad');
                const person = document.createElement('div')
                person.className = 'modal-font'
                const h = document.createElement('h1');
                h.innerHTML = data.username;
                person.appendChild(h)
                parent.appendChild(person);
            })
        }
    })
}

// count the total post of people that current user follows
function count_total_post(token, id) {
    const url = 'http://localhost:5000/user?id=' + id;
    const result = fetch(url, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'User Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                data.following.map(person => {
                    count_person_post(token, person);
                })
            })
        }
    })
}

// count the total post of person with id
function count_person_post(token, id) {
    const url = 'http://localhost:5000/user?id=' + id;
    const result = fetch(url, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'User Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                total_post += data.posts.length;
            })
        }
    })
}

// using for polling
// count the total post of prople that current user follows
function update_total_count(token, id) {
    const url = 'http://localhost:5000/user?id=' + id;
    const result = fetch(url, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'User Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                data.following.map(person => {
                    update_count(token, person);
                })
            })
        }
    })
}

// using for polling
// count the total post of person with id
function update_count(token, id) {
    const url = 'http://localhost:5000/user?id=' + id;
    const result = fetch(url, {
        method :'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        },
    }).then((data) => {
        if (data.status === 400) {
            errPopup('feed pad', 'Malformed Request')
        } else if (data.status === 403) {
            errPopup('feed pad', 'Invalid Auth Token')
        } else if (data.status === 404) {
            errPopup('feed pad', 'User Not Found')
        } else if (data.status === 200) {
            data.json().then(data => {
                check_counter += data.posts.length;
            })
        }
    })
}

// convert time into dd/mm/yyyy
function convertTime(time) {

    var t = new Date();
    // parseInt(t.getTime())
    var tmp = parseInt(t.getTime()) + parseInt(time);
    t = new Date(tmp);

    var date = t.getDate() + '/' + t.getMonth() + '/' + t.getFullYear() + '  ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
    return date;
}

const pad = document.getElementById("feed pad")
// this milestone 6
// poll the server
var update = setInterval(() => {
    currentUserId = localStorage.getItem('id');
    console.log(currentUserId)
    if(currentUserId != null) {
        var timer2 = setInterval(update_total_count(currentUserToekn, currentUserId), 10000);
        console.log('check is ' + check_counter)
        if (check_counter > 0) {
            if (check_counter > total_post) {
                success_info("Someone has new post!<br>Please refresh the page to update!")
                total_post = check_counter
            }
            check_counter = 0;
        }
        // clearInterval(update);
    }
}, 2000);

// Infinite Scroll
pad.addEventListener('scroll', () => {
    // console.log(pad.scrollTop)
    // console.log(pad.scrollHeight - pad.offsetHeight)
    const height = pad.scrollHeight - pad.offsetHeight;
    if (pad.scrollTop == height) {
        console.log('bottom')
        console.log(counter)
        console.log(token)
        load_feed(currentUserToekn, counter, 10)
        // counter++;
    }

})

document.getElementById('signin').addEventListener('click', () => register());

document.getElementById('register').addEventListener('click', () => {
    document.getElementById('login pad').style.display="none";
    document.getElementById('register pad').style.display="block";

});

document.getElementById('back-login').addEventListener('click', () => {
    document.getElementById('register pad').style.display="none";
    document.getElementById('login pad').style.display="block";

});

document.getElementById('login').addEventListener('click', () => login());
api.makeAPIRequest('dummy/user')
    .then(r => console.log(r));

/**
 * Pop up error
 * @param {string} msg 
 * @param {string} screen 
 */

function errPopup(screen, msg) {
    document.getElementById(screen).style.display="none";
    document.getElementById("err").innerHTML = msg;
    document.getElementById('error pad').style.display="block";

    var btn = document.createElement('button');
    btn.id = 'close'
    btn.innerHTML = 'Close';
    btn.className = 'close-button';
    var parent = document.getElementById('error-container');
    parent.appendChild(btn)

    document.getElementById('close').addEventListener('click', () => {
        document.getElementById('error pad').style.display="none"
        document.getElementById(screen).style.display="block"
        parent.removeChild(btn)
    })

}