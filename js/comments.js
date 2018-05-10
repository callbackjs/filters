// HTTP OK status code
const STATUS_OK = 200

// interval to refresh comments at
const COMMENTS_REFRESH_INTERVAL = 2000

const commentForm = document.getElementsByTagName('form')[0]
const commentList = document.getElementById('comment-list')

commentForm.addEventListener('submit', event => {
  event.preventDefault()

  const nameInput = commentForm.querySelector('input[type="text"]')
  const messageTextarea = commentForm.querySelector('textarea')

  const name = nameInput.value
  const message = messageTextarea.value

  // ensure both name and comment exist
  if (!name || !message) {
    return
  }

  // add comment via AJAX
  const request = new XMLHttpRequest()
  request.addEventListener('load', event => {
    if (request.status === STATUS_OK) {
      addCommentToList(name, message)
      nameInput.value = ''
      messageTextarea.value = ''
    }
  })

  request.open('POST', '/comments')
  request.setRequestHeader('Content-type', 'application/json')
  request.send(JSON.stringify({
    name: name,
    message: message,
  }))
})

let lastResponse = null

function refreshComments() {
  // get comments via AJAX
  const request = new XMLHttpRequest()
  request.addEventListener('load', event => {
    if (request.status === STATUS_OK) {
      const comments = JSON.parse(request.responseText)
      lastResponse = request.responseText

      commentList.innerHTML = ''
      comments.forEach(comment => {
        addCommentToList(comment.name, comment.message)
      })
    }

    // refetch comments periodically
    setTimeout(refreshComments, COMMENTS_REFRESH_INTERVAL)
  })

  request.open('GET', '/comments')
  request.send()
}

refreshComments()

/* Adds a comment to the list of comments.
 *
 * Arguments:
 * name -- who posted the comment
 * message -- the message of the comment
 */
function addCommentToList(name, message) {
  const commentLi = renderComment(name, message)
  commentList.appendChild(commentLi)
}

/* Renders a comment with the given name and message to be listed in the
 * #comments div. */
function renderComment(name, message) {
  return tag('li', {}, [
    tag('p', {}, [
      tag('strong', {}, name),
      ' ',
      message
    ])
  ])
}

/* Creates and returns an HTMLElement representing a tag of the given name.
 * attrs is an object, where the key-value pairs represent HTML attributes to
 * set on the tag. contents is an array of strings/HTMLElements (or just
 * a single string/HTMLElement) that will be contained within the tag.
 *
 * Examples:
 * tag('p', {}, 'A simple paragraph') => <p>A simple paragraph</p>
 * tag('a', {href: '/about'}, 'About') => <a href="/about">About</a>
 *
 * tag('ul', {}, tag('li', {}, 'First item')) => <ul><li>First item</li></ul>
 *
 * tag('div', {}, [
 *   tag('h1', {'class': 'headline'}, 'JavaScript'),
 *   ' is awesome, ',
 *   tag('span', {}, 'especially in CS42.')
 * ])
 * => <div>
 *      <h1 class="headline">JavaScript</h1>
 *      is awesome,
 *      <span>especially in CS42.</span>
 *    </div>
 */
function tag(name, attrs, contents) {
  const element = document.createElement(name)
  for (const attrName in attrs) {
    element.setAttribute(attrName, attrs[attrName])
  }

  // If contents is a single string or HTMLElement, make it an array of one
  // element; this guarantees that contents is an array below.
  if (!(contents instanceof Array)) {
    contents = [contents]
  }

  contents.forEach(piece => {
    if (piece instanceof HTMLElement) {
      element.appendChild(piece)
    } else {
      // must create a text node for a raw string
      element.appendChild(document.createTextNode(piece))
    }
  })

  return element
}
