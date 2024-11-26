import axios from 'axios';
import React, {  useEffect, useReducer } from 'react';
import "./OmdbMovies.css"
import Loader from './Loader';

function OmdbMovies() {
    let initialState={
        movies:[],
        search:"",
        loading:false,
        error:false,
        searchedMovie:"avengers"
    
    }
    let MovieReducer=(state,action)=>{
        switch(action.type){
        case "LOADING":return {...state,loading:true,error:false};
        case "MOVIES":return{...state,movies:action.movies,loading:false,error:false};
        case "SEARCH":return{...state,search:action.search};
        case "SEARCHED":return{...state,searchedMovie:action.searchedMovie};
        case "ERROR":return{...state,error:true,loading:false}
        default:return state
    
        }
    }
   

    
    let [state,dispatcher]=useReducer(MovieReducer,initialState)
  
    let {movies,search,searchedMovie,loading,error}=state

    let updateUsers = async () => { 

       dispatcher({type:"LOADING"})
       
           try {
            let {data:{Search}}= await axios.get(`https://www.omdbapi.com/?s=${searchedMovie}&apikey=4d8bec6f`);
       
            dispatcher({type:"MOVIES",movies:Search||[]})
           
           
        }
        catch (err) {
            console.log(err)
            dispatcher({type:"ERROR"})
          
           
        }
    }

    let updateSearch = ({ target: { value } }) =>
    {
        dispatcher({type:"SEARCH",search:value})
      
    }

    useEffect(() => {
        updateUsers();
    }, [searchedMovie])

    console.log(movies)

    let searchMovie = () =>
    {
        dispatcher({type:"SEARCHED",searchedMovie:search})
        
    }

  return (
      <section className='omdb'>
         <h1 style={{color:"#ff5722"}}>MOVIES</h1>
          <div className='search'>
              <input type="search" placeholder='Movie Name' onChange={updateSearch} />
              <button onClick={searchMovie}>Search</button>
          </div>
          {loading ? (<Loader />):(
            <>
          {error && <h1 style={{color:"Red",fontSize:"40px"}}>API Error</h1>}
          {!error &&(
          <div className='movie-list'>
        {movies.length>0?movies.map((movie) =>
            {
            return <div key={movie.imdbID} className='movie'>
            <img src={movie.Poster==="N/A" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png" :movie.Poster} />
                    
                </div>
        }):(<h1 style={{color:"white"}}>No Movie Found</h1>)}
          </div>
          )}
            </>
          )}
    </section>
  )
}

export default OmdbMovies

