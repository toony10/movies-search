"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { AiFillCloseCircle } from 'react-icons/ai';

const API_KEY = '5068b159a5d0e5982cb8000bbaf9b06b';
const searchMovies = async (query) =>
{
  try
  {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${ API_KEY }&query=${ query }`
    );
    const data = await response.json();
    return data.results;
  } catch (error)
  {
    console.error('Error', error);
    return [];
  }
};

const getGenreNames = async () =>
{
  try
  {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${ API_KEY }`
    );
    const data = await response.json();
    const genres = data.genres;

    return genres;
  } catch (error)
  {
    console.error('Error', error);
    return [];
  }
};


export default function Home()
{
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);

  const handleSearch = async () =>
  {
    const movies = await searchMovies(query);
    setResults(movies);
    console.log(movies);
  };

  const fetchGenres = async () =>
  {
    const genresData = await getGenreNames();
    setGenres(genresData);
  };

  useEffect(() =>
  {
    fetchGenres();

  }, []);

  const getGenreNamesByIds = (genreIds) =>
  {
    const genreNames = genreIds.map((genreId) =>
    {
      const genre = genres.find((genre) => genre.id === genreId);
      return genre ? genre.name : '';
    });

    return genreNames.join(' - ');
  };

  return (
    <div className="flex flex-col">
      <form onChange={ handleSearch } className="m-auto mt-10 flex relative">
        <input
          type="text"
          placeholder="Search movies..."
          value={ query }
          onChange={ (e) => setQuery(e.target.value) }
          className='w-72 h-10 outline-none p-4 rounded-md'
        />
        { query && <AiFillCloseCircle className='absolute top-3 right-3 cursor-pointer text-gray-300 hover:text-white transition duration-200' onClick={ () => setQuery('') } /> }
      </form>

      { query && (
        <ul className="m-auto transition duration-300">
          { results.map((movie) => (
            <li key={ movie.id } className="flex justify-center m-10 cursor-pointer hover:bg-gray-700 rounded-lg transition duration-300">
              <div className='m-auto p-2 text-left w-1/2'>
                <p className='text-3xl'>{ movie.title }</p>
                <p className='text-sm text-gray-500'>{ getGenreNamesByIds(movie.genre_ids) }</p>
                {/* <p>{if}</p> */ }
              </div>
              <Image
                src={ `https://image.tmdb.org/t/p/w500${ movie.backdrop_path || movie.poster_path
                  }` }
                className='w-1/3 rounded-r-md'
                alt="movie Poster"
                objectFit="cover"
                width={ 100 }
                height={ 100 }
                sizes='100vh'
              />
            </li>
          )) }
        </ul>
      ) }
    </div>
  );
}

