// HTTP OK status code
var STATUS_OK = 200;

// interval to refresh comments at
var COMMENTS_REFRESH_INTERVAL = 2000;

var commentForm = document.getElementsByTagName('form')[0];
var commentList = document.getElementById('comment-list');
var commentTemplate = document.getElementById('comment-template');

commentForm.addEventListener('submit', function(event) {
  event.preventDefault();

  var nameInput = commentForm.querySelector('input[type="text"]');
  var messageTextarea = commentForm.querySelector('textarea');

  var name = nameInput.value;
  var message = messageTextarea.value;

  // ensure both name and comment exist
  if (!name || !message) {
    return;
  }

  // add comment via AJAX
  var request = new XMLHttpRequest();
  request.addEventListener('load', function(event) {
    if (request.status === STATUS_OK) {
      addCommentToList(name, message);
      nameInput.value = '';
      messageTextarea.value = '';
    }
  });

  request.open('POST', '/comments');
  request.setRequestHeader('Content-type', 'application/json');
  request.send(JSON.stringify({
    name: name,
    message: message
  }));
});

var lastResponse = null;

(function refreshComments() {
  // get comments via AJAX
  var request = new XMLHttpRequest();
  request.addEventListener('load', function(event) {
    if (request.status === STATUS_OK) {
      var comments = JSON.parse(request.responseText);
      lastResponse = request.responseText;

      commentList.innerHTML = '';
      comments.forEach(function(comment) {
        addCommentToList(comment.name, comment.message);
      });
    }
  });

  request.open('GET', '/comments');
  request.send();

  setTimeout(refreshComments, COMMENTS_REFRESH_INTERVAL);
})();

/* Adds a comment to the list of comments.
 *
 * Arguments:
 * name -- who posted the comment
 * message -- the message of the comment
 */
function addCommentToList(name, message) {
  var commentLi = renderComment(name, message);
  commentList.appendChild(commentLi);
}

/* Renders a comment with the given name and message to be listed in the
 * #comments div. */
function renderComment(name, message) {
  return tag('li', [
    tag('p', [
      tag('strong', name),
      ' ',
      message
    ])
  ]);
}

/* Creates and returns an HTMLElement representing a tag of the given name.
 * attrs is an object, where the key-value pairs represent HTML attributes to
 * set on the tag. contents is an array of strings/HTMLElements (or just a single
 * string/HTMLElement) that will be contained within the tag.
 *
 * Note that attrs is an optional parameter, and can be ommitted.
 *
 * Examples:
 * tag('p', 'A simple paragraph') => <p>A simple paragraph</p>
 * tag('a', {href: '/about'}, 'About') => <a href="/about">About</a>
 *
 * tag('ul', tag('li', 'First item')) => <ul><li>First item</li></ul>
 *
 * tag('div', [
 *   tag('h1', {'class': 'headline'}, 'JavaScript'),
 *   ' is awesome, ',
 *   tag('span', "especially in CS42.")
 * ])
 * => <div>
 *      <h1 class="headline">JavaScript</h1>
 *      is awesome
 *      <span>especially in CS42.</span>
 *    </div>
 */
function tag(name, attrs, contents) {
  // attrs is optional
  if (!contents) {
    contents = attrs;
    attrs = [];
  }

  var element = document.createElement(name);
  for (var attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }

  // If contents is a single string or HTMLElement, make it an array of one
  // element; this guarantees that contents is an array below.
  if (!(contents instanceof Array)) {
    contents = [contents];
  }

  contents.forEach(function(piece) {
    if (piece instanceof HTMLElement) {
      element.appendChild(piece);
    } else {
      // must create a text node for a raw string
      element.appendChild(document.createTextNode(piece));
    }
  });

  return element;
}
