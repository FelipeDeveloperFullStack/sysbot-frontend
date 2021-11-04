import { combineReducers } from 'redux'
import keyWordReducer from './keyWordReducer'

export const reducers = combineReducers({
  keywords: keyWordReducer
})