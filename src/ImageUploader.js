import React , {useState} from 'react';
import { Button } from '@material-ui/core';
import './imageUploader.css';
import firebase  from 'firebase';
import {storage , db } from './firebase';


const ImageUploader = ( {username} ) => {

    //states
    const [caption , setCaption] = useState(''); //caption
    const [image,setImage] = useState(null);//image
    const[progress , setProgress] = useState(0); 
    //we will have a progress bar to show completion of uploading process.



    //funtions

    //to upload image
    const handleChange = (e) => {
        // this function functions when we upload an image , like what to do with the image etc.
        if(e.target.files[0] ) {
            //if an image was selected

            setImage(e.target.files[0]); // store it in 'image' state.
            // file[0] means if we select multiple files it will select only the first one.
        }
    }

    //to upload to database
    const handleUpload = () => {
        //here we push the uploaded image to the firebase
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        /**
            storage ->access the storage
            ref.(images/) get a reference to images folder and store file named 'image.name'. 
            ${image.name} -> name of the file that we selected.
            .put(image) -> put the image at that location.
         */

        //progress or time taken to upload

        uploadTask.on( //this is an event listener
            "state_changed",
            (snapshot) =>{
                //progress function.......
                const progress = Math.round(
                    (snapshot.bytesTransferred)/(snapshot.totalBytes) * 100
            );

            setProgress(progress); 
            },
            (error) => {
                //error function 
                console.log(error.message);
                alert(error.message);
                //we generally do not show the whole error message on alert.
                //we show something simple like  'error occured ' or something.
            },
            ()=>{
                //upload complete function
                storage 
                    .ref('images') // get a reference to 'images' folder in storage.
                    .child(image.name) // go to the 'image.name' file in the 'images' folder.
                    .getDownloadURL() // we use this download url as the '+' prop in posts. 
                    .then(url =>{
                        //post image inside db
                        db.collection('posts').add({
                            //when we created collection on firebase we named is 'posts'.

                            //to show recent posts on top we use timestamp
                            timestamp : firebase.firestore.FieldValue.serverTimestamp(), // we use timestamp of the server so time at from where we are uploading does not matter.

                            // we wll add a new item to the db, a set of { imageURL , username and caption}
                            caption:caption, // caption entered during upload process
                            imageURL : url , // url from .getDownloadURL()
                            username : username, // but we do not have this 'username'
                                                     // username is of the current active user(the one who is logged in right now)
                                                     // we import username from App.js
                                                     //we import it as a prop
                        })

                        //once task is done , reset everything to zero.
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }

    return (
        
            // {/* image Uploader */}
            <div className="image-uploader">
                {/* progress bar */}
                <progress  className="progressBar" value={progress} max ='100'/>

                {/* caption uploader */}
                <input
                 type ="text" placeholder="Enter a caption..."
                  onChange = {(event) => setCaption(event.target.value)} /* everytime the input changes , even by one character we set it to caption */
              />

                {/* file picker */}
                <input type="file"  onChange={handleChange}/>

                {/* post button */}
                <Button
                variant= 'contained'
                color='primary'
                onClick={handleUpload}
                className="upload-button"
                >
                    Upload
                </Button>
                
            </div>

    )
}

export default ImageUploader;