import {React,useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';
import ImageUploader from './ImageUploader';


//modal stuff
function getModalStyle() {
    const top = 50;
    const left = 50 ;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  


const App = () => {

    const classes = useStyles();
    const [modalStyle]=useState(getModalStyle);

    // state: a short term memory space for react.
    // this state will store all data regarding , "username","imageURL","caption"
    //and it will create the posts itself , rather than we passing the props every single time.

    // ====================================================================// ====================================================================
    // ====================================================================// ====================================================================
    // ====================================================================// ====================================================================

    //   STATES
    //state to save the array of posts

    const [posts,setPosts]= useState([]);
   
    //this is not empty , we are pulling info from the firebase database.
    //this is example of a hook.
    //this is basically an api.

    //state to check if modal is open (sign up modal)
    const [open , setOpen] = useState(false);

    // state for 'sign in' modal
    const [openSignIn , setOpenSignIn] = useState(false);

    // sign up states
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    //to check if user is logged in or out
    const [user,setUser] = useState(null);


    // ====================================================================// ====================================================================
    // ====================================================================// ====================================================================
    // ====================================================================// ====================================================================

    // auth useEffect

    useEffect(()=>{
        //any time any authentication change happens , log in , log out , new account , it fires up.
        const unsubscribe = auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                //user has logged in
                console.log(authUser);
                setUser(authUser);
                //storing the user in 'user' state will make sure that on refreshing the same user stays logged in.
              
            }else{
                //user has logged out
                setUser(null);
            }

        })

        return()=> {
            //clean up action
            unsubscribe();
    }

    }, [user , username]) // any time 'user' state or 'username' state change we fire up this code.



    //         USEEFFECT HOOKS    

    //useEffect -: Runs a piece of code based on a specific condition.
                // If condition satisfied , run code.

    // UseEffect hook to update the post feeds when database is changed.
    useEffect(()=>{
        db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id, // id stores id of the post
                post: doc.data() // post stores the username , imageURL and caption.
            })))
        })
        // name of collection on firebase database(that we need here) is 'posts'
        //onSnapshot is a powerful event listener.
        //everytime database changes even a bit , it gets activated.
        //every single time new post is added , this code fires.

        //now what does the code do ,
        // it updates the "posts" state with the new posts.

        
        
        // doc.data means {usename , imageURL , caption}




    }, [])
   

    // useEffect(()=>{
        
    // }, [posts]) runs when app component loads and when "posts" changes.
    
    // useEffect(()=>{

    // }, []) runs only when and every time app component loads .

    
    //===================================================================
    //===================================================================
    //===================================================================

    //signup function

    const signUp = (event) => {
        event.preventDefault(); // to prevent refreshing everytime we press create account
        
        auth
        .createUserWithEmailAndPassword(email , password)
        .then((authUser)=>{
            return authUser.user.updateProfile({
                displayName: username ,
            });
        } )
        .catch((error) => alert(error.message));

        //to create user using 'auth' from firebase
        // the 'email' and 'password' , comes from the states.
        
        // alert in case of any error

        //* no ; after first line *

        setOpen(false);
    }

    //sign in function

    const signIn = (event) => {
        event.preventDefault();

        auth
        .signInWithEmailAndPassword(email , password)
        .catch((error) => alert(error.message))

        setOpenSignIn(false);
        
    }


    //===================================================================
    //===================================================================
    //===================================================================


    return (
        <div className="app">
            
            

            {/* header */}
            <div className="app__header">
                <img 
                className="app__headerImage"
                src="http://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-768x480.png"
                alt="logo"/>

                {/* buttons */}
                {/* button to sign up or log out */}
            {/* we have used conditional statement to show one of the buttons depeending on if the use is logged in or not. */}
            
            {user ? (
                <div className="logout_container">
                <h2>{user.displayName}</h2> 
                {/* to show who is logged in */}
                <Button
                variant="contained"
                color="secondary"
                onClick={()=> auth.signOut()}>
                    Log Out
                </Button>
                </div>
            ) : (

                <div className="app__logInContainer">
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>setOpen(true)}>
                        Sign Up
                    </Button>

                    <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>setOpenSignIn(true)}>
                        Sign In
                    </Button>
                        
                    </div>

            )}


            </div>

              {/* //============================================================================================== */}
        {/* //============================================================================================== */}
        {/* //============================================================================================== */}
        {/* //============================================================================================== */}
        {/* //============================================================================================== */}


            {/* Modal */}
            
            {/* what is a modal
            
             Creates a backdrop, for disabling interaction below the modal.
             It disables scrolling of the page content while open.
             It properly manages focus; moving to the modal content, and keeping it there until the modal is closed.
             . */}

            {/* <Modal
            open={open} // piece of state to keep track of if the modal is open.
            onClose={handleClose} //when to close the modal
            > */}

            
            <Modal
            open={open}
            onClose={() => setOpen(false)} // onClose is an eventListener, it listens for any 'click outside the modal'.
            >
            {/* <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>
            <SimpleModal />
            </div> */}

            <div style={modalStyle} className={classes.paper}> 
            
            <form className='app__signUp'>
                <center>
                    <img
                    className="app__headerImage"
                    src="http://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-768x480.png"
                    alt="logo"/>
                </center>
                
                <Input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                <Input
                         type="email"
                        placeholder="email id"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                <Input
                        type="text"
                        placeholder="password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={signUp}>
                    Create Account
                </Button>
            </form>           
            </div>

            </Modal>

            <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)} // onClose is an eventListener, it listens for any 'click outside the modal'.
            >
            
            <div style={modalStyle} className={classes.paper}> 
            
            <form className='app__signIn'>
                <center>
                    <img
                    className="app__headerImage"
                    src="http://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-768x480.png"
                    alt="logo"/>
                </center>
                
                <Input
                         type="email"
                        placeholder="email id"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                
                <Input
                        type="text"
                        placeholder="password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={signIn}>
                    Log In 
                </Button>
            </form>           
            </div>

            </Modal>

        {/* //============================================================================================== */}
        {/* //============================================================================================== */}
        {/* //============================================================================================== */}
        {/* //============================================================================================== */}
        {/* //============================================================================================== */}





            {/* posts */}
            {/* <div className="the_posts">
                <Post/>
                <Post/>
                <Post/>
                <Post/>
            </div> */}
          
            {/* posts */}

            <div className="the_posts">
                {posts.map(({id , post})=>(
                    // whenever returning something use ()
                    <Post
                        key={id} 
                        // adding unique key is import
                        //without key : new post added , re-render all the posts.
                        //with key: new post added , render the new one only.
                        username={post.username}
                        imageURL={post.imageURL}
                        caption={post.caption}
                        user={user}
                        postId={id}
                    />
                ))}
            </div>
             

            {/* sometie user may not exist , so user?.displayName means if user exists -> check if user.displayName is there. */}
            {user?.displayName ? (
                //username present , means someone is logged in
                <ImageUploader username ={user.displayName} />

            // {/* we need to pass username as a prop to the imageUploader */}
            // {/* "user" state has the usernaem store by te name of displayName */}
            // {/* but displayName will be available only when someone is logged in */}
            
            ):(
                // no username , means no one is logged in
                
                <h2>Please Sign In or Sign Up , to upload images.</h2>
            )}

        </div>
    )
}

export default App;

