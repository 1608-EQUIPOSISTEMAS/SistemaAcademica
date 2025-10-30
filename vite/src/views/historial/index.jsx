import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { Chip, IconButton, CircularProgress, Box } from '@mui/material';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { alumnosService } from 'services/alumnosService';

// ==============================|| COLUMNAS ||============================== //

const columns = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 80 
  },
  {
    field: 'curso_programa',
    headerName: 'Curso/Programa',
    width: 200,
    editable: false
  },
  {
    field: 'nombre_apellido',
    headerName: 'Nombre Completo',
    width: 220,
    editable: false
  },
  {
    field: 'usuario_microsoft',
    headerName: 'Usuario Microsoft',
    width: 250,
    editable: false
  },
  {
    field: 'fecha_inicio',
    headerName: 'Fecha Inicio',
    width: 130,
    valueFormatter: (params) => {
      return new Date(params.value).toLocaleDateString('es-PE');
    }
  },
  {
    field: 'fecha_fin',
    headerName: 'Fecha Fin',
    width: 130,
    valueFormatter: (params) => {
      return new Date(params.value).toLocaleDateString('es-PE');
    }
  },
  {
    field: 'estado',
    headerName: 'Estado',
    width: 140,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === 'ACTIVADO' ? 'success' : 'error'}
        size="small"
        sx={{ 
          fontWeight: 500,
          backgroundColor: params.value === 'ACTIVADO' ? '#e8f5e9' : '#ffebee',
          color: params.value === 'ACTIVADO' ? '#2e7d32' : '#c62828'
        }}
      />
    )
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton 
          size="small" 
          sx={{ color: '#90caf9' }}
          onClick={() => handleView(params.row)}
        >
          <IconEye size={18} />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: '#ffb74d' }}
          onClick={() => handleEdit(params.row)}
        >
          <IconEdit size={18} />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: '#ef5350' }}
          onClick={() => handleDelete(params.row.id)}
        >
          <IconTrash size={18} />
        </IconButton>
      </Box>
    )
  }
];

// ==============================|| HANDLERS ||============================== //

const handleView = (row) => {
  console.log('Ver:', row);
  // Implementar modal o navegación
};

const handleEdit = (row) => {
  console.log('Editar:', row);
  // Implementar modal o navegación
};

const handleDelete = async (id) => {
  if (window.confirm('¿Está seguro de eliminar este registro?')) {
    try {
      await alumnosService.delete(id);
      window.location.reload(); // O mejor: actualizar estado
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  }
};

// ==============================|| PÁGINA PRINCIPAL ||============================== //

export default function SamplePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      const response = await alumnosService.getAll();
      setRows(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar alumnos:', err);
      setError('Error al cargar los datos. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainCard title="Historial de Cuentas">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: '#90caf9' }} />
        </Box>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard title="Historial de Cuentas">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <p style={{ color: '#ef5350' }}>{error}</p>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Historial de Cuentas">
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ 
            pagination: { 
              paginationModel: { pageSize: 10, page: 0 } 
            } 
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #e0e0e0'
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#ffffff'
            }
          }}
        />
      </div>
    </MainCard>
  );
}