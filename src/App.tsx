import { useScrollToTop } from './hooks/use-scroll-to-top';
import Router from 'src/routes/section';
import ThemeProvider from 'src/theme';

function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App
