import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 3, mt: 'auto' }}>
      <Typography variant="caption">
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          component={RouterLink}
          to="#"
          underline="hover"
          target="_blank"
          variant="caption"
          color="text.primary"
        >
          CRM
        </Link>
        <Link
          component={RouterLink}
          to="https://we-educacion.com/"
          underline="hover"
          target="_blank"
          variant="caption"
          color="text.primary"
        >
          Pagina Web
        </Link>
      </Stack>
    </Stack>
  );
}
