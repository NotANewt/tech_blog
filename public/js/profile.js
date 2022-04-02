const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#post-title').value.trim();
  const contents = document.querySelector('#post-desc').value.trim();

  if (title && contents) {
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({ title, contents }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create post');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete post');
    }
  }
};

const updateButtonHandler = async (event) => {
  console.log('I clicked the update button');
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to update post');
    }
  }
};

document
  .querySelector('.new-post-form')
  .addEventListener('submit', newFormHandler);

// if statement to make sure there are posts to add delete buttons to before adding event listeners
let postList = document.querySelector('.post-list');
let deleteBtn = document.getElementById('delete-btn');
let updateBtn = document.getElementById('update-btn');

if (postList) {
  deleteBtn.addEventListener('click', delButtonHandler);
  updateBtn.addEventListener('click', updateButtonHandler);
}
