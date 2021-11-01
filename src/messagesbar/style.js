import styled from 'styled-components'
import List from '@material-ui/core/List'

export const TitleMessageBar = styled.div`
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold
`

export const MessageBarContainer = styled.div`
  padding: 10px;
`

export const ListStyled = styled.div`

height: ${props => props.innerHeight}px;

overflow-y: scroll; 
::-webkit-scrollbar {
  width: 10px;
};

overflow-x: hidden;

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 
  border-radius: 10px;
};
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #4849A1; 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #4849A1; 
}
`