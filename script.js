const postsContainer = document.getElementById('posts-container');
const filter = document.getElementById('filter');
const loading = document.querySelector('.loader');
const errorMessage = document.getElementById('error-message');

const postsPerRequest = 5;
let currPage = 1;

loadPostsBatch();

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadPostsBatch();
  }
});

filter.addEventListener('input', filterPosts);
////////////////////////////////////////////Helper Functions

async function loadPostsBatch() {
  loading.classList.add('show');
  errorMessage.style.display = 'none';

  //We had to add the following await to keep loading visible while fetching posts.
  await getPostsJson()
    .then((posts) => {
      [...posts].forEach((post) => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
      });
    })
    .catch(() => {
      errorMessage.style.display = 'block';
    });

  loading.classList.remove('show');
  currPage++;
}

async function getPostsJson() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${postsPerRequest}&_page=${currPage}`
  );
  const data = await res.json();
  return data;
}

function createPostElement(post) {
  const postElement = document.createElement('div');
  postElement.classList.add('post');
  postElement.innerHTML = `
    <div class="number">${post.id}</div>
    <div class="post-info">
        <h2 class="post-title">${post.title}</h2>    
        <p class="post-body">${post.body}</p>
    </div>    
  `;
  return postElement;
}

function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post');
  posts.forEach((post) => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();
    if (title.indexOf(term) > -1 || body.indexOf(term) > -1)
      post.style.display = 'flex';
    else post.style.display = 'none';
  });
}
