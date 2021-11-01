import React, { useEffect } from 'react'
import { Feed, Icon } from 'semantic-ui-react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Message } from 'semantic-ui-react'


export default function MessageContent(props) {

  return (
    <div style={{ padding: '10px' }}>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <img src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>Elliot Fu</Feed.User> enviou uma mensagem pra você no grupo <a>Locutores brasil</a>
              <Feed.Date>1 Hour Ago</Feed.Date>
            </Feed.Summary>
            <Feed.Extra text>
              Ours is a life of constant reruns. We're always circling back to where
              we'd we started, then starting all over again. Even if we don't run
              extra laps that day, we surely will come back for more of the same
              another day soon.
              </Feed.Extra>
            <Feed.Meta style={{ display: 'flex', flexDirection: 'row' }}>
              <TextField id="filled-basic" label="Responder" variant="filled" multiline size='small' style={{maxWidth: '90%', minWidth: '90%'}} />
              <Button variant="contained" size='small'>Enviar resposta!</Button>
            </Feed.Meta>
            <Message info>
              <Message.Header>Respondido!</Message.Header>
            </Message>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </div>
  )
}