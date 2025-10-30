import { useState, useEffect, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Typography,
  Divider
} from '@mui/material';
import { IconPlus, IconTrash, IconUpload, IconCheck, IconDownload } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { plantillaService } from 'services/plantillaService';

export default function SamplePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nombreApellido, setNombreApellido] = useState('');
  const fileInputRef = useRef(null);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'nombre_apellido',
      headerName: 'Nombre y Apellido',
      width: 300
    },
    {
      field: 'procesado',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'PROCESADO' : 'PENDIENTE'}
          color={params.value ? 'success' : 'warning'}
          size="small"
          sx={{
            fontWeight: 500,
            backgroundColor: params.value ? '#e8f5e9' : '#fff3e0',
            color: params.value ? '#2e7d32' : '#f57c00'
          }}
        />
      )
    },
    {
      field: 'uploaded_at',
      headerName: 'Fecha de Carga',
      width: 200,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString('es-PE');
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          sx={{ color: '#ef5350' }}
          onClick={() => handleDelete(params.row.id)}
        >
          <IconTrash size={18} />
        </IconButton>
      )
    }
  ];

  useEffect(() => {
    fetchPlantillas();
  }, []);

  const fetchPlantillas = async () => {
    try {
      setLoading(true);
      const response = await plantillaService.getAll();
      setRows(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar plantillas:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setNombreApellido('');
    setError(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setError(null);
  };

  const handleOpenUploadModal = () => {
    setOpenUploadModal(true);
    setError(null);
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
    setError(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await plantillaService.downloadTemplate();
      
      // Crear blob y descargar
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'plantilla_nombres_apellidos.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar plantilla:', err);
      setError('Error al descargar la plantilla');
    }
  };

  const handleSubmit = async () => {
    if (!nombreApellido.trim()) {
      setError('El nombre y apellido es obligatorio');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await plantillaService.create({ nombre_apellido: nombreApellido.trim() });
      await fetchPlantillas();
      handleCloseModal();
    } catch (err) {
      console.error('Error al crear registro:', err);
      setError(err.response?.data?.message || 'Error al crear el registro');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      try {
        await plantillaService.delete(id);
        await fetchPlantillas();
      } catch (err) {
        console.error('Error al eliminar:', err);
        setError('Error al eliminar el registro');
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Por favor seleccione un archivo Excel válido (.xls o .xlsx)');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await plantillaService.uploadExcel(formData);
      await fetchPlantillas();
      handleCloseUploadModal();
      alert('Excel cargado exitosamente');
    } catch (err) {
      console.error('Error al cargar Excel:', err);
      setError(err.response?.data?.message || 'Error al cargar el archivo Excel');
    } finally {
      setSubmitting(false);
      event.target.value = '';
    }
  };

  const handleProcesar = async () => {
    if (window.confirm('¿Procesar todos los registros pendientes?')) {
      try {
        setLoading(true);
        await plantillaService.procesarCSV();
        await fetchPlantillas();
        alert('Registros procesados exitosamente');
      } catch (err) {
        console.error('Error al procesar:', err);
        alert('Error al procesar registros');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <MainCard title="Plantilla de Carga">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: '#90caf9' }} />
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Plantilla de Carga - Nombre y Apellidos">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={handleOpenModal}
          sx={{
            backgroundColor: '#90caf9',
            '&:hover': { backgroundColor: '#64b5f6' },
            textTransform: 'none'
          }}
        >
          Agregar Individual
        </Button>
        
        <Button
          variant="contained"
          startIcon={<IconUpload />}
          onClick={handleOpenUploadModal}
          sx={{
            backgroundColor: '#64b5f6',
            '&:hover': { backgroundColor: '#42a5f5' },
            textTransform: 'none'
          }}
        >
          Cargar Excel
        </Button>
        
        <Button
          variant="contained"
          startIcon={<IconCheck />}
          onClick={handleProcesar}
          sx={{
            backgroundColor: '#81c784',
            '&:hover': { backgroundColor: '#66bb6a' },
            textTransform: 'none'
          }}
        >
          Procesar Pendientes
        </Button>
      </Box>

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
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #e0e0e0'
            }
          }}
        />
      </div>

      {/* MODAL AGREGAR INDIVIDUAL */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}>
          Agregar Nombre y Apellido
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre y Apellido"
            name="nombre_apellido"
            value={nombreApellido}
            onChange={(e) => setNombreApellido(e.target.value)}
            placeholder="Ej: Juan Pérez García"
            required
            autoFocus
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Button
            onClick={handleCloseModal}
            sx={{ color: '#757575', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{
              backgroundColor: '#90caf9',
              '&:hover': { backgroundColor: '#64b5f6' },
              textTransform: 'none'
            }}
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL CARGA MASIVA */}
      <Dialog
        open={openUploadModal}
        onClose={handleCloseUploadModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}>
          Carga Masiva desde Excel
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Para cargar múltiples registros, primero descarga la plantilla Excel, 
              llénala con los nombres y apellidos, y luego cárgala aquí.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<IconDownload />}
              onClick={handleDownloadTemplate}
              fullWidth
              sx={{
                borderColor: '#90caf9',
                color: '#90caf9',
                '&:hover': {
                  borderColor: '#64b5f6',
                  backgroundColor: '#e3f2fd'
                },
                textTransform: 'none',
                py: 1.5
              }}
            >
              Descargar Plantilla Excel
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Una vez que hayas llenado la plantilla, carga el archivo aquí:
            </Typography>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
            />

            <Button
              variant="contained"
              startIcon={<IconUpload />}
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              fullWidth
              sx={{
                backgroundColor: '#64b5f6',
                '&:hover': { backgroundColor: '#42a5f5' },
                textTransform: 'none',
                py: 1.5
              }}
            >
              {submitting ? 'Cargando...' : 'Seleccionar y Cargar Excel'}
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Button
            onClick={handleCloseUploadModal}
            sx={{ color: '#757575', textTransform: 'none' }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}