// post component 
import React,{useState,useEffect} from 'react';
import './post.css';
import Avatar from "@material-ui/core/Avatar";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { db } from './firebase';
import { Button } from '@material-ui/core';
import firebase from 'firebase';

function Post ({postId, username , caption, imageURL,user}){
    // we pass the postId as a prop so that we can individually target the posts and show their comments underneath them.

    const [comments,setComments]=useState([]);//state to store comments.
    const [comment,setComment]=useState("");//state to store individual comment.

    const [likes,setLikes]=useState(0);

    //useEffect to handle comments.
    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
    
        return () => {
        unsubscribe();
         };
      }, [postId]);
    

    // comment posting
    const postComment = (event) =>{
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username:user.displayName ,
            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
        });

        setComment("");
    }


    return(
        <div className="post">
            {/* header-> avatar(dp) + usernames */}

            <div className='post__header'>
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                    // this line pulls the first letter of alt(the usertname) into profile picture
                />
                <h3>{username}</h3>
            </div>

            {/* image */}
            <img 
            className="post__image"
            src={imageURL} 
            alt=""/>

            {/* username + caption */}
            <h3 className="post__text"><strong>@{username}</strong> : {caption}</h3>

            {/* likebutton */}
            <h3><button onClick={()=>setLikes(likes+1)}>
                    <ThumbUpIcon/>
                </button>:{likes}</h3>

            {/* to display the comments below the post */}

            <div className="post_comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong>: {comment.text}
                    </p>
                ))}
            </div>

            {/* we will show the make a comment option only if there is a user signed in. */}

            {user && (
                <form className ="post_commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add  a comment......"
                    value={comment}
                    onChange = {(e) => setComment(e.target.value)}
                />
                <button
                    className="post__button"
                    type="submit"
                    disabled={!comment}
                    // if there is no comment typed, the button is disabled.
                    onClick={postComment}

                    >
                        Post
                    </button>
            </form>
            )}

        </div>
    );
}

export default Post;
