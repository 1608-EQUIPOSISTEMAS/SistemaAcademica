import { BrowserRouter } from 'react-router-dom';

// routing
import ThemeRoutes from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <NavigationScroll>
        <BrowserRouter basename="/free">
          <ThemeRoutes />
        </BrowserRouter>
      </NavigationScroll>
    </ThemeCustomization>
  );
}