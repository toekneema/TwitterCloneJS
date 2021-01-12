$(function() {
    renderSite(); 
}); 

export const renderSite = function() {
    const $root = $('#root');
    renderTweets();
    $(document).on('click', '#like', likeTweet);
    $(document).on('click', '#reply', reply);
    $(document).on('click', '#retweet', retweet);
    $(document).on('click', '#create', createTweetForm);
    $(document).on('click', '#edit', editTweetForm);
    $(document).on('click', '#delete', deleteTweet);
}

export async function renderTweets() {
    const $root = $('#root');

    const result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });

    let tweets = `<div id="tweets">`;
    for (let i = 0; i < 50; i++) {
        let tweet = result.data[i];
        if (tweet.isMine == true) {
            tweets += 
            `<div class="card iden mine" data-id="${tweet.id}">
                <h4><strong>${tweet.author}</strong></h4>
                <div id="body">
                    <p id="bodyText">${tweet.body}</p>
                    <p>Likes: ${tweet.likeCount} Replies: ${tweet.replyCount} Retweets: ${tweet.retweetCount} </p>
                    <div id="buttons">
                        <button type="submit" id="edit">${"Edit"}</button>
                        <button type="button" id="retweet">${"Retweet"}</button>
                        <button type="button" id="delete">${"Delete"}</button>   
                    </div>
                </div>
            </div>`
        } else {
            if (!tweet.isLiked){
                tweets += 
                `<div class="card iden" data-id="${tweet.id}">
                    <h4><strong>${tweet.author}</strong></h4>
                    <div id="body">
                        <p id="bodyText">${tweet.body}</p>
                        <p>Likes: ${tweet.likeCount} Replies: ${tweet.replyCount} Retweets: ${tweet.retweetCount} </p>
                        <div id="buttons">
                            <button type="button" id="like">${"Like"}</button>
                            <button type="button" id="reply">${"Reply"}</button>
                            <button type="button" id="retweet">${"Retweet"}</button>
                        </div>
                    </div>
                </div>`;
            }
            else {
                tweets += 
                `<div class="card iden" data-id="${tweet.id}">
                    <h4><strong>${tweet.author}</strong></h4>
                    <div id="body">
                        <p id="bodyText">${tweet.body}</p>
                        <p>Likes: ${tweet.likeCount} Replies: ${tweet.replyCount} Retweets: ${tweet.retweetCount} </p>
                        <div id="buttons">    
                            <button type="button" id="like">${"Unlike"}</button>
                            <button type="button" id="reply">${"Reply"}</button>
                            <button type="button" id="retweet">${"Retweet"}</button>
                        </div>
                    </div>
                </div>`;
            }
        }
    }
    tweets += `</div>`;
    $root.append(tweets);
}

export async function createTweetForm(e) {
    e.preventDefault();
    $('#create').replaceWith(
        `<form id="form">
            <textarea class="text" placeholder="Sco pa tu mana"></textarea><br>
            <button id="save" type="submit">${"Post"}</button>
            <button id="cancel" type="button">${"Cancel"}</button>
        </form>`
    );
    $(document).on('click', '#save', postTweet);
    $(document).on('click', '#cancel', cancelTweet);
}

export async function postTweet(e) {
    e.preventDefault();
    let form = $(event.target).closest("#form");
    let tweet = form.children(".text").val();

    await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        data: {
            "type": "tweet",
            "body": tweet,
        },
        withCredentials: true,
    });
    form.replaceWith(`<button type="button" class="button is-link" id="create">Tweet</button>`);
    $('#tweets').replaceWith(renderTweets());
    location.reload();
}

export async function cancelTweet(e) {
    e.preventDefault();

    $('#form').replaceWith(`<button type="button" class="button is-link" id="create">Tweet</button>`);
}

export async function editTweetForm(e) {
    e.preventDefault();

    $(event.target).closest("#body").replaceWith(
        `<form id="formBody">
            <textarea id="editText">${$(event.target).closest("#body").children("#bodyText").text()}</textarea><br>
            <button id="saveEdit" type="submit">${"Save"}</button>
            <button id="cancelEdit" type="button">${"Cancel"}</button>
        </form>`
    );

    $(document).on('click', '#saveEdit', saveEdit);
    $(document).on('click', '#cancelEdit', cancelEdit);
    location.reload();
}

export async function saveEdit(e) {
    e.preventDefault();

    let id = $(event.target).parent().closest(".iden").data("id");
    let tweet = $(event.target).closest("#formBody").children("#editText").val();

    await axios({
        method: 'put',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
        data: {
            "body": tweet,
        },
    });

    $('#tweets').replaceWith(renderTweets());
    location.reload();
}

export async function cancelEdit(e) {
    e.preventDefault();
    $('#tweets').replaceWith(renderTweets());
    location.reload();
}

export async function deleteTweet(e) {
    e.preventDefault();

    let id = $(event.target).parent().closest(".iden").data("id");

    await axios({
        method: 'delete',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
    });

    $('#tweets').replaceWith(renderTweets());
    location.reload();
}

export async function likeTweet(e) {
    e.preventDefault();
    
    let id = $(event.target).parent().closest(".iden").data("id");
    
    const result = await axios({
        method: 'get',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
    });

    if (result.data.isLiked == false){
        await axios({
            method: 'put',
            url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/like`,
            withCredentials: true,
        });
    } else {
        await axios({
            method: 'put',
            url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/unlike`,
            withCredentials: true,
        });
    }
    
    $("#tweets").replaceWith(renderTweets());
    location.reload();
}

export async function reply(e){
    e.preventDefault();

    $(event.target).closest("#buttons").replaceWith(
        `<form id="formBody">
            <textarea id="editText" placeholder="Enter your reply"></textarea><br>
            <button id="postReply" type="submit">${"Reply"}</button>
            <button id="cancelReply" type="button">${"Cancel"}</button>
        </form>`
    );
    
    $(document).on('click', '#postReply', postReply);
    $(document).on('click', '#cancelReply', cancelReply);
}

export async function postReply(e) {
    e.preventDefault();

    let id = $(event.target).parent().closest(".iden").data("id");
    let reply = $(event.target).closest("#formBody").children('#editText').val();

    await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "reply",
            "parent": id,
            "body": reply,
        },
    });

    $('#tweets').replaceWith(renderTweets());
    location.reload();
}

export async function cancelReply(e) {
    e.preventDefault();
    $('#tweets').replaceWith(renderTweets());
    location.reload();
}

export async function retweet(e) {
    e.preventDefault();

    $(event.target).closest("#buttons").replaceWith(
        `<form id="formBody">
            <textarea id="editText" placeholder="Text for retweet"></textarea><br>
            <button id="postRetweet" type="submit">${"Retweet"}</button>
            <button id="cancelRetweet" type="button">${"Cancel"}</button>
        </form>`
    );
    
    $(document).on('click', '#postRetweet', postRetweet);
    $(document).on('click', '#cancelRetweet', cancelRetweet);
}

export async function postRetweet(e) {
    e.preventDefault();

    let id = $(event.target).parent().closest(".iden").data("id");
    let reply = $(event.target).closest("#formBody").children('#editText').val();

    const tweet = await axios({
        method: 'get',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
    });

    await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": id,
            "body": `${reply}<br><h3>Retweeting ${tweet.data.author}</h3>${tweet.data.body}`,
        }
    });

    $('#tweets').replaceWith(renderTweets());
    location.reload();
}

export async function cancelRetweet(e) {
    e.preventDefault();
    $('#tweets').replaceWith(renderTweets());
    location.reload();
}