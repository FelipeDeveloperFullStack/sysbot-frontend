import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
/** Semantic Ui */
import { Message } from 'semantic-ui-react'
/** Material Ui */
import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
/** Icon */
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'word',
    headerName: 'Palavra chave',
    width: 200,
    editable: true,
  }
]

export default function DataTable(props) {
  const [rowSelected, setRowSelected] = React.useState([])
  const [validatorField, setValidatorField] = React.useState({ isValidate: false, message: '' })
  const [word, setWord] = React.useState('')
  const dispatch = useDispatch()
  
  const selectionModel = (event) => {
    setRowSelected(event)
  }

  const onSubmit = () => {
    if(String(word).trim() === ''){
      setValidatorField({ isValidate: true, message: 'Esse campo é obrigatório!'})
    }else{
      setValidatorField({ isValidate: false, message: ''})
      dispatch({
        type: 'ADD_KEY_WORD',
        keywords: {
          keyWord: ['po', 'uiui']
        }
      })
    }
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
        <div style={{display: 'flex', paddingBottom: '5px'}}>
          <div>
            <TextField size='small' 
                       label="Palavra chave" 
                       variant="outlined"
                       value={word}
                       error={validatorField.isValidate}
                       helperText={validatorField.isValidate && validatorField.message}
                       onChange={(event) => setWord(event.target.value)}/>
          </div>
          <div style={{position: 'relative', top: '2px', paddingLeft: '3px'}}>
            <Button startIcon={<AddIcon/>} variant="contained" color="primary" type='submit' onClick={() => onSubmit()}>
              Adicionar
            </Button> </div>
        </div>
      {rowSelected.length ?
        <Message>
          <Message.Header>{rowSelected.length > 1 ? 'Excluir linhas selecionadas?' : 'Excluir linha selecionada?'}</Message.Header>
          <Button startIcon={<DeleteForeverIcon/>} variant="contained" color="secondary" size='small'>
            {`Excluir(${rowSelected.length > 1 ? `${rowSelected.length} linhas` : `${rowSelected.length} linha`})`}
          </Button>
        </Message> : <></>}
      <DataGrid
        rows={props.words}
        columns={columns}
        pagination={false}
        hideFooterPagination={true}
        hideFooter={true}
        checkboxSelection
        onSelectionModelChange={selectionModel}
      />
    </div>
  );
}
