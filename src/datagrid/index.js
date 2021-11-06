import React from 'react';
import { useDispatch } from 'react-redux'
/** Semantic Ui */
import { Message } from 'semantic-ui-react'
/** Material Ui */
import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
/** Icon */
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
/** Util */
import { getLocalStorage, setLocalStorage } from '../util/util'
/** Services Api */
import { postApi, getApi, deleteApi } from '../services/api'
/** Lodash */
import _ from 'lodash'

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
  const [words, setWords] = React.useState([])
  const [validatorField, setValidatorField] = React.useState({ isValidate: false, message: '' })
  const [word, setWord] = React.useState('')

  const selectionModel = (event) => {
    setRowSelected(event)
  }

  React.useEffect(() => {
    getKeyWords()
  }, [])

  const getKeyWords = async () => {
    let result = await getApi({ url: 'key_words' })
    let { words } = result.data
    if(words){
      result = tratarDados({ dados: result.data.words })
      setLocalStorage({ key: 'key_words', value: result })
      setWords(result)
    }else {
      setWords([])
    }
  }

  const tratarDados = ({ dados }) => {
    let dadosTemp = []
    Array.from(dados).forEach((value, index) => {
      if (value.word) {
        dadosTemp.push({
          id: index + 1,
          _id: value.id,
          word: value.word
        })
      }
    })
    return dadosTemp
  }

  const onSubmit = async () => {
    if (String(word).trim() === '') {
      setValidatorField({ isValidate: true, message: 'Esse campo é obrigatório!' })
    } else {
      setValidatorField({ isValidate: false, message: '' })
      setWord("")

      await insertAndUpdate({ word })
    }
  }

  const insertAndUpdate = async ({ word }) => {
    try {
      let result = await postApi({ url: '/key_words/update', data: { word } })
      let { isUpdate } = result.data
      if (isUpdate) {
        props.setOpenShowMessage(true)
        getKeyWords()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteKeyWord = async () => {
    let result = []
    rowSelected.map(id => {
      words.filter(item => {
        if (Number(item.id) === Number(id)) {
          result.push(item)
        }
      })
    })
    setLocalStorage({ key: 'key_words_deleted', value: result })
    let keyWordsDeleted = getLocalStorage({ key: 'key_words_deleted' })

    let resultWordsDeleted = await deleteApi({ url: '/key_words/delete', data: [keyWordsDeleted] })
    let { isUpdate } = resultWordsDeleted.data
    if (isUpdate) {
      props.setOpenShowMessage(true)
      getKeyWords()
    }
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', paddingBottom: '5px' }}>
        <div>
          <TextField size='small'
            label="Palavra chave"
            variant="outlined"
            value={word}
            error={validatorField.isValidate}
            helperText={validatorField.isValidate && validatorField.message}
            onChange={(event) => setWord(event.target.value)} />
        </div>
        <div style={{ position: 'relative', top: '2px', paddingLeft: '3px' }}>
          <Button startIcon={<AddIcon />} variant="contained" color="primary" type='submit' onClick={() => onSubmit()}>
            Adicionar
            </Button> </div>
      </div>
      {rowSelected.length ?
        <Message>
          <Message.Header>{rowSelected.length > 1 ? 'Excluir linhas selecionadas?' : 'Excluir linha selecionada?'}</Message.Header>
          <Button startIcon={<DeleteForeverIcon />} variant="contained" color="secondary" size='small' onClick={() => handleDeleteKeyWord()}>
            {`Excluir(${rowSelected.length > 1 ? `${rowSelected.length} linhas` : `${rowSelected.length} linha`})`}
          </Button>
        </Message> : <></>}
      <DataGrid
        rows={words}
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
