import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Message } from 'semantic-ui-react'
import Button from '@material-ui/core/Button';
/** Icon */
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'word',
    headerName: 'Palavra chave',
    width: 200,
    editable: true,
  }
]

const rows = [
  { id: 1, word: 'Snow' },
  { id: 2, word: 'Lannister' },
  { id: 3, word: 'Lannister' },
  { id: 4, word: 'Stark' },
  { id: 5, word: 'Targaryen' },
  { id: 6, word: 'Melisandre' },
  { id: 7, word: 'Clifford' },
  { id: 8, word: 'Frances' },
  { id: 9, word: 'Roxie' },
]

export default function DataTable() {
  const [rowSelected, setRowSelected] = React.useState([])
  const selectionModel = (event) => {
    setRowSelected(event)
  }
  return (
    <div style={{ height: 400, width: '100%' }}>
      {rowSelected.length ?
        <Message>
          <Message.Header>{rowSelected.length > 1 ? 'Excluir linhas selecionadas?' : 'Excluir linha selecionada?'}</Message.Header>
          <Button startIcon={<DeleteForeverIcon/>} variant="contained" color="secondary" size='small'>
            {`Excluir(${rowSelected.length > 1 ? `${rowSelected.length} linhas` : `${rowSelected.length} linha`})`}
          </Button>
        </Message> : <></>}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        onSelectionModelChange={selectionModel}
      />
    </div>
  );
}
