import {
  getAllCountries,
  getAllMovies,
  getSearchedMovies,
  getSingleMovie,
  setAllCountries,
  setAllMovies,
  setSearchedMovies,
  setSingleMovie,
} from "../reducers/movieSlice";
import { all, takeLatest, call, put } from "redux-saga/effects";
import { ApiResponse } from "apisauce";
import API from "../../utiles/api";
import { CountriesList, MovieData, MoviesPayload, SearchPayload, SearchResponse } from "../@types";
import { PayloadAction } from "@reduxjs/toolkit";
import { MovieCardById } from "../../@types";

function* movieWorker(action: PayloadAction<MoviesPayload>) {
  const data = action.payload
  const response: ApiResponse<MovieData> = yield call(API.getMovies, data);
  if (response.ok && response.data) {
    yield put(setAllMovies(response.data.docs));
  } else {
    console.error("Movies error", response.problem);
  }
}

function* singlMovieWorker(action: PayloadAction<string>) {
  const response: ApiResponse<MovieCardById> = yield call(
    API.getSingleMovie,
    action.payload
  );
  if (response.ok && response.data) {
    yield put(setSingleMovie(response.data));
  } else {
    console.error("Movies error", response.problem);
  }
}

function* getSearchedMovieWorker(action: PayloadAction<string>) {
  const response: ApiResponse<MovieData> = yield call(
    API.getSearch,
    action.payload
  );
  if (response.ok && response.data) {
    yield put(
      setSearchedMovies(response.data.docs),
    ); console.log(111);
  } else {
    console.error("Searched Movie error", response.problem);
  }
}

function* getSavedMovies(){

}

function* getAllCountriesWorker() {
  console.log(111);
  
  const response: ApiResponse<CountriesList[]> = yield call(API.getCountries);
  if (response.ok && response.data) {
    console.log(response.data);
    
    yield put(setAllCountries(response.data));
  } else {
    console.error("Countries error", response.problem);
  }
}

export default function* movieSagaWatcher() {
  yield all([
    takeLatest(getAllMovies, movieWorker),
    takeLatest(getSingleMovie, singlMovieWorker),
    takeLatest(getSearchedMovies, getSearchedMovieWorker),
    takeLatest(getAllCountries, getAllCountriesWorker)
  ]);
}
