import React, { useEffect } from 'react'
/** Semantic */
import { Feed, Icon } from 'semantic-ui-react'
import { Message } from 'semantic-ui-react'
/** Material ui */
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar';

export default function MessageContent(props) {
  return (
    <>
      {props.messages.map(item => {
        return (
          <div style={{ padding: '10px' }}>
            <Feed>
              <Feed.Event>
                <Feed.Label>
                  <Avatar>{String(item.displayName).substr(0,1)}</Avatar>
                </Feed.Label>
                <Feed.Content>
                  <Feed.Summary>
                    <Feed.User>{item.displayName}</Feed.User> enviou uma mensagem pra você no grupo <a>{item.chatName}</a>
                    <Feed.Date>{item.created_at}</Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra text>
                    {item.body}
                  </Feed.Extra>
                  {item.isAnswered === false &&
                    <Feed.Meta style={{ display: 'flex', flexDirection: 'row' }}>
                      <TextField id="filled-basic" label="Digite aqui sua resposta" variant="filled" multiline size='small' style={{ maxWidth: '90%', minWidth: '90%' }} />
                      <Button variant="contained" size='small'>Responder</Button>
                    </Feed.Meta>}
                  {item.isAnswered === true &&
                    <Message info>
                      <Message.Header>Respondido!</Message.Header>
                    </Message>}
                </Feed.Content>
              </Feed.Event>
            </Feed>
          </div>
        )
      })}
    </>
  )
}
  // else {
  //   return (
  //     <>
  //       <Message info>
  //         <Message.Header style={{paddingBottom: '10px'}}>Carregando...</Message.Header>
  //         <LinearProgress />
  //       </Message>
  //     </>
  //   )
  // }