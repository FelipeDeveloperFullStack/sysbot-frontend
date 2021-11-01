import React from 'react'
import { TitleMessageBar, MessageBarContainer, ListStyled } from './style'
import Badge from '@material-ui/core/Badge';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function MessageBar(props) {
  const [valueTab, setValueTab] = React.useState(0)
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue)
  }

  return (
    <MessageBarContainer>

      <TitleMessageBar>Mensagens</TitleMessageBar>

        <ListStyled innerHeight={window.innerHeight}>
          {props.contacts && Array.from(props.contacts).map((contact, key) => {
            return (
              <ListItem alignItems="flex-start" key={key} 
                        style={{ right: '16px', position: 'relative' }} 
                        button 
                        onClick={(event) => handleListItemClick(event, key)}
                        selected={selectedIndex === key}>
                <ListItemAvatar>
                  <Avatar alt={contact.formattedName} src={contact.profilePicThumbObj.eurl} />
                </ListItemAvatar>
                <ListItemText
                  primary={contact.formattedName}
                  secondary={
                    <React.Fragment>
                      <div style={{ fontSize: '10px' }}>Nº {contact.id.user}</div>
                    </React.Fragment>
                  }
                />
              </ListItem>
            )
          })}
        </ListStyled>
    </MessageBarContainer>
  )
}