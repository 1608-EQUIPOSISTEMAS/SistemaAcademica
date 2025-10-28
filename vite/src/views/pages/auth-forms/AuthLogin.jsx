import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// services
import { authService } from 'services/authService';

export default function AuthLogin() {
  const navigate = useNavigate();
  
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.email || !formData.password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.login(formData.email, formData.password);
      navigate('/dashboard'); // Redirigir al dashboard
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <InputLabel htmlFor="email-login">Correo Electrónico</InputLabel>
          <OutlinedInput
            id="email-login"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="password-login">Contraseña</InputLabel>
          <OutlinedInput
            id="password-login"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            fullWidth
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  name="checked"
                  sx={{ color: '#90caf9' }}
                />
              }
              label="Recordarme"
            />
            <Typography
              variant="subtitle1"
              component={Link}
              to="/forgot-password"
              sx={{ textDecoration: 'none', color: '#90caf9' }}
            >
              ¿Olvidaste tu contraseña?
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            disableElevation
            disabled={loading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#90caf9',
              '&:hover': { backgroundColor: '#64b5f6' },
              color: '#fff',
              textTransform: 'none',
              fontSize: '16px',
              padding: '12px'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}