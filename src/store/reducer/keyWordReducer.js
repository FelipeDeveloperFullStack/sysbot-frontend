export const initialState = {
  words: []
}

export default function keyWordReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_KEY_WORD': {
      return { ...state, words: action.keyWord }
    }
    default: {
      return state
    }
  }
}

